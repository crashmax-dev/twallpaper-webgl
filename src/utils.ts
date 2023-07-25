const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER']

export function loadShaders(
  gl: WebGLRenderingContext,
  shaderSources: string[]
): WebGLShader[] {
  const shaders: WebGLShader[] = []
  for (let i = 0; i < shaderSources.length; ++i) {
    const shader = loadShader(
      gl,
      shaderSources[i],
      // @ts-ignore
      gl[defaultShaderType[i]]
    )

    if (!shader) {
      console.log(`Error loading shader ${shaderSources[i]}`)
      continue
    }

    shaders.push(shader)
  }

  return shaders
}

function loadShader(
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number
): WebGLShader | null {
  // Create the shader object
  const shader = gl.createShader(shaderType)!

  // Load the shader source
  gl.shaderSource(shader, shaderSource)

  // Compile the shader
  gl.compileShader(shader)

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader)
    console.log(
      "*** Error compiling shader '" +
        shader +
        "':" +
        lastError +
        `\n` +
        shaderSource
          .split('\n')
          .map((l, i) => `${i + 1}: ${l}`)
          .join('\n')
    )
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function hexToVec3(
  hex: string
): readonly [r: number, g: number, b: number] {
  if (hex.startsWith('#')) {
    hex = hex.slice(1)
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return [r, g, b] as const
}

export function loadTexture(
  gl: WebGLRenderingContext,
  url: string
): WebGLTexture | null {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  )

  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    )

    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url

  return texture
}

function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) === 0
}
