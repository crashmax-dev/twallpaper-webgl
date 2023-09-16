import { colors, config } from './config.js'
import fragmentShader from './fragment-shader.glsl?raw'
import { hexToVec3 } from './hex-to-vec3.js'
import { loadShaders } from './load-shaders.js'
import {
  maskInputSize,
  maskList,
  paneColors,
  paneInputMask
} from './tweakpane.js'
import vertexShader from './vertex-shader.glsl?raw'

import './styles.css'

const wallpaperContainer =
  document.querySelector<HTMLElement>('.wallpaper-wrap')!
const gradientCanvas = document.createElement('canvas')
gradientCanvas.classList.add('wallpaper-canvas')

const maskContainer = document.createElement('div')
maskContainer.classList.add('wallpaper-pattern')
wallpaperContainer.append(gradientCanvas, maskContainer)

function updateMask(): void {
  const { isEnabled, backgroundColor, maskImage, size } = config.pattern

  wallpaperContainer.style.setProperty('--tw-size', `${size}px`)
  wallpaperContainer.style.setProperty('--tw-background', backgroundColor)

  wallpaperContainer.style.setProperty(
    '--tw-image',
    `url(patterns/${maskImage}.svg)`
  )

  if (isEnabled) {
    gradientCanvas.classList.add('wallpaper-mask')
  } else {
    gradientCanvas.classList.remove('wallpaper-mask')
  }
}

updateMask()

const gl = gradientCanvas.getContext('webgl')!
if (!gl) {
  throw new Error('WebGL not supported')
}

// setup GLSL program
const program = gl.createProgram()!
if (!program) {
  throw new Error('Unable to create WebGLProgram')
}

// load shaders
const shaders = loadShaders(gl, [vertexShader, fragmentShader])
for (const shader of shaders) {
  gl.attachShader(program, shader)
}

gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  alert('Unable to initialize the shader program.')
}

gl.useProgram(program)

// look up where the vertex data needs to go.
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

// Create a buffer to put three 2d clip space points in
const positionBuffer = gl.createBuffer()

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// fill it with a 2 triangles that cover clipspace
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1,
    -1, // first triangle
    1,
    -1,
    -1,
    1,
    -1,
    1, // second triangle
    1,
    -1,
    1,
    1
  ]),
  gl.STATIC_DRAW
)

// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

// Tell it to use our program (pair of shaders)
gl.useProgram(program)

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation)

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
gl.vertexAttribPointer(
  positionAttributeLocation,
  2, // 2 components per iteration
  gl.FLOAT, // the data is 32bit floats
  false, // don't normalize the data
  0, // 0 = move forward size * sizeof(type) each iteration to get the next position
  0 // start at the beginning of the buffer
)

const resolutionLoc = gl.getUniformLocation(program, 'resolution')
const color1Loc = gl.getUniformLocation(program, 'color1')
const color2Loc = gl.getUniformLocation(program, 'color2')
const color3Loc = gl.getUniformLocation(program, 'color3')
const color4Loc = gl.getUniformLocation(program, 'color4')
const color1PosLoc = gl.getUniformLocation(program, 'color1Pos')
const color2PosLoc = gl.getUniformLocation(program, 'color2Pos')
const color3PosLoc = gl.getUniformLocation(program, 'color3Pos')
const color4PosLoc = gl.getUniformLocation(program, 'color4Pos')

const keyPoints = [
  [0.265, 0.582], //0
  [0.176, 0.918], //1
  [1 - 0.585, 1 - 0.164], //0
  [0.644, 0.755], //1
  [1 - 0.265, 1 - 0.582], //0
  [1 - 0.176, 1 - 0.918], //1
  [0.585, 0.164], //0
  [1 - 0.644, 1 - 0.755] //1
]
let keyShift = 0
let targetColor1Pos: number[]
let targetColor2Pos: number[]
let targetColor3Pos: number[]
let targetColor4Pos: number[]

updateTargetColors()

function updateTargetColors() {
  targetColor1Pos = keyPoints[keyShift % 8]
  targetColor2Pos = keyPoints[(keyShift + 2) % 8]
  targetColor3Pos = keyPoints[(keyShift + 4) % 8]
  targetColor4Pos = keyPoints[(keyShift + 6) % 8]
  keyShift = (keyShift + 1) % 8
}

let color1Pos = [targetColor1Pos![0], targetColor1Pos![1]]
let color2Pos = [targetColor2Pos![0], targetColor2Pos![1]]
let color3Pos = [targetColor3Pos![0], targetColor3Pos![1]]
let color4Pos = [targetColor4Pos![0], targetColor4Pos![1]]

renderGradientCanvas()

function renderGradientCanvas() {
  gl.uniform2fv(resolutionLoc, [gl.canvas.width, gl.canvas.height])
  gl.uniform3fv(color1Loc, colors.color1)
  gl.uniform3fv(color2Loc, colors.color2)
  gl.uniform3fv(color3Loc, colors.color3)
  gl.uniform3fv(color4Loc, colors.color4)
  gl.uniform2fv(color1PosLoc, color1Pos)
  gl.uniform2fv(color2PosLoc, color2Pos)
  gl.uniform2fv(color3PosLoc, color3Pos)
  gl.uniform2fv(color4PosLoc, color4Pos)

  gl.drawArrays(
    gl.TRIANGLES,
    0, // offset
    6 // num vertices to process
  )
}

function distance(p1: number[], p2: number[]) {
  return Math.sqrt(
    // (p1[0] - p2[0]) * (p1[0] - p2[0]),
    (p1[1] - p2[1]) * (p1[1] - p2[1])
  )
}

const speed = 0.1
let animating = false
function animate() {
  animating = true
  if (
    distance(color1Pos, targetColor1Pos) > 0.01 ||
    distance(color2Pos, targetColor2Pos) > 0.01 ||
    distance(color3Pos, targetColor3Pos) > 0.01 ||
    distance(color3Pos, targetColor3Pos) > 0.01
  ) {
    color1Pos[0] = color1Pos[0] * (1 - speed) + targetColor1Pos[0] * speed
    color1Pos[1] = color1Pos[1] * (1 - speed) + targetColor1Pos[1] * speed
    color2Pos[0] = color2Pos[0] * (1 - speed) + targetColor2Pos[0] * speed
    color2Pos[1] = color2Pos[1] * (1 - speed) + targetColor2Pos[1] * speed
    color3Pos[0] = color3Pos[0] * (1 - speed) + targetColor3Pos[0] * speed
    color3Pos[1] = color3Pos[1] * (1 - speed) + targetColor3Pos[1] * speed
    color4Pos[0] = color4Pos[0] * (1 - speed) + targetColor4Pos[0] * speed
    color4Pos[1] = color4Pos[1] * (1 - speed) + targetColor4Pos[1] * speed
    renderGradientCanvas()
    requestAnimationFrame(animate)
  } else {
    animating = false
  }
}

paneInputMask.on('change', () => {
  updateMask()
})

paneColors.on('change', (event) => {
  // @ts-ignore
  colors[event.target.key] = hexToVec3(event.value)
  renderGradientCanvas()
})

maskList.on('change', (event) => {
  config.pattern.maskImage = event.value
  updateMask()
})

maskInputSize.on('change', () => {
  updateMask()
})

document.addEventListener('click', () => {
  updateTargetColors()
  if (!animating) requestAnimationFrame(animate)
})
