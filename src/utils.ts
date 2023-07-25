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

export function hexToVec(
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
