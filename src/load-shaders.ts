export function loadShaders(
  gl: WebGLRenderingContext,
  shaderSources: [vertexShader: string, fragmentShader: string]
): readonly [WebGLShader, WebGLShader] {
  const [vertexShader, fragmentShader] = shaderSources
  return [
    loadShader(gl, vertexShader, gl.VERTEX_SHADER),
    loadShader(gl, fragmentShader, gl.FRAGMENT_SHADER)
  ] as const
}

function loadShader(
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number
): WebGLShader {
  const shader = gl.createShader(shaderType)!
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  return shader
}
