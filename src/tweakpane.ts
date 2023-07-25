import { Pane } from 'tweakpane'

import { config, tweakpaneConfig } from './config.js'
import { hexToVec4 } from './utils.js'

export const tweakpane = new Pane({
  document,
  expanded: true,
  title: document.title
})

const colors = tweakpane.addFolder({
  title: 'Colors'
})

colors.addInput(tweakpaneConfig.colors, 'color1')
colors.addInput(tweakpaneConfig.colors, 'color2')
colors.addInput(tweakpaneConfig.colors, 'color3')
colors.addInput(tweakpaneConfig.colors, 'color4')

colors.on('change', (event) => {
  // @ts-ignore
  config.colors[event.presetKey] = hexToVec4(event.value)
})
