const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER']

export function loadShaders(
  gl: WebGLRenderingContext,
  shaderSources: string[]
) {
  const shaders = []
  for (let i = 0; i < shaderSources.length; ++i) {
    shaders.push(
      loadShader(
        gl,
        shaderSources[i],
        // @ts-ignore
        gl[defaultShaderType[i]]
      )
    )
  }

  return shaders
}

function loadShader(
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number
) {
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
