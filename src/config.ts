import { hexToVec3 } from './hex-to-vec3.js'

export const maskImages = [
  'animals',
  'astronaut_cats',
  'beach',
  'cats_and_dogs',
  'christmas',
  'fantasy',
  'late_night_delight',
  'magic',
  'math',
  'paris',
  'games',
  'snowflakes',
  'space',
  'star_wars',
  'sweets',
  'tattoos',
  'underwater_world',
  'zoo',
  'unicorn'
]

export const config = {
  pattern: {
    isEnabled: false,
    maskImage: maskImages[0],
    size: 420,
    backgroundColor: '#000'
  },
  colors: {
    color1: '#fec496',
    color2: '#dd6cb9',
    color3: '#962fbf',
    color4: '#4f5bd5'
  }
  // colors: {
  //   color1: '#dbddbb',
  //   color2: '#6ba587',
  //   color3: '#d5d88d',
  //   color4: '#88b884',
  // }
}

export const colors = {
  color1: hexToVec3(config.colors.color1),
  color2: hexToVec3(config.colors.color2),
  color3: hexToVec3(config.colors.color3),
  color4: hexToVec3(config.colors.color4)
}
