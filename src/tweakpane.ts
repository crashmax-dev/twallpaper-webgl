import { Pane } from 'tweakpane'
import type { ListBladeApi } from 'tweakpane'

import { config, maskImages } from './config.js'

const container = document.querySelector<HTMLElement>('#tweakpane')!

const tweakpane = new Pane({
  container,
  expanded: true,
  title: document.title
})

export const paneColors = tweakpane.addFolder({
  title: 'Colors'
})

paneColors.addBinding(config.colors, 'color1')
paneColors.addBinding(config.colors, 'color2')
paneColors.addBinding(config.colors, 'color3')
paneColors.addBinding(config.colors, 'color4')

const paneMask = tweakpane.addFolder({
  title: 'Mask'
})

export const maskList = paneMask.addBlade({
  view: 'list',
  label: 'image',
  options: maskImages.map((maskImage) => ({
    text: maskImage,
    value: maskImage
  })),
  value: config.pattern.maskImage
}) as ListBladeApi<string>

export const maskInputSize = paneMask.addBinding(config.pattern, 'size', {
  min: 420,
  max: 1000,
  step: 1
})

export const paneInputMask = paneMask.addBinding(config.pattern, 'isEnabled', {
  label: 'mask'
})
