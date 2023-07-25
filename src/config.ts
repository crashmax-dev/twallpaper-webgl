import { hexToVec } from './utils'

export const tweakpaneConfig = {
  colors: {
    color1: '#dbddbb',
    color2: '#6ba587',
    color3: '#d5d88d',
    color4: '#88b884'
  }
}

export const config = {
  colors: {
    color1: hexToVec(tweakpaneConfig.colors.color1),
    color2: hexToVec(tweakpaneConfig.colors.color2),
    color3: hexToVec(tweakpaneConfig.colors.color3),
    color4: hexToVec(tweakpaneConfig.colors.color4)
  }
}
