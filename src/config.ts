import { hexToVec } from './utils'

export const config = {
  mask: false,
  texture: 'animals',
  colors: {
    color1: '#dbddbb',
    color2: '#6ba587',
    color3: '#d5d88d',
    color4: '#88b884'
  }
}

export const colors = {
  color1: hexToVec(config.colors.color1),
  color2: hexToVec(config.colors.color2),
  color3: hexToVec(config.colors.color3),
  color4: hexToVec(config.colors.color4)
}
