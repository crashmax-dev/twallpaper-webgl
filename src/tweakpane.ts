import { Pane } from 'tweakpane'

import { config } from './config.js'

const container = document.querySelector<HTMLElement>('#tweakpane')!

const tweakpane = new Pane({
  container,
  expanded: true,
  title: document.title
})

export const paneColors = tweakpane.addFolder({
  title: 'Colors'
})

paneColors.addInput(config.colors, 'color1')
paneColors.addInput(config.colors, 'color2')
paneColors.addInput(config.colors, 'color3')
paneColors.addInput(config.colors, 'color4')

export const paneInputMask = tweakpane.addInput(config, 'mask')
