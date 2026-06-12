import { toPng } from 'html-to-image'
import { EXPORT_PIXEL_RATIO, POSTER_HEIGHT, POSTER_WIDTH } from './posterSizes'

export function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement('a')
  link.download = fileName
  link.href = dataUrl
  link.click()
}

export async function capturePosterPng(element) {
  if (!element) throw new Error('Poster element not found.')

  await document.fonts.ready

  // Do not pass width/height — forcing dimensions blurs text.
  return toPng(element, {
    pixelRatio: EXPORT_PIXEL_RATIO,
    cacheBust: true,
    skipAutoScale: true,
    style: {
      transform: 'none',
      opacity: '1',
    },
  })
}

export function getExportFileName(baseName) {
  const outW = POSTER_WIDTH * EXPORT_PIXEL_RATIO
  const outH = POSTER_HEIGHT * EXPORT_PIXEL_RATIO
  return baseName.replace('.png', `_${outW}x${outH}.png`)
}
