import { type CanvasElement } from './types'

export const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'

export const isPlainObject: (arg: any) => boolean = arg =>
  Object.prototype.toString.call(arg) === '[object Object]'

export const msgPrefix = '[UnityWebgl]: '
export const log = (msg: string) => {
  console.log(msgPrefix, msg)
}
log.warn = (msg: string) => console.warn(msgPrefix, msg)
log.error = (msg: string) => console.error(msgPrefix, msg)

/**
 * query CanvasElement
 * @param {string | HTMLCanvasElement} canvas
 * @returns
 */
export function queryCanvas(canvas: CanvasElement): HTMLCanvasElement | null {
  if (canvas instanceof HTMLCanvasElement) {
    return canvas
  } else if (typeof canvas === 'string') {
    return document.querySelector(canvas)
  } else {
    log.warn('CanvasElement not found.')
    return null
  }
}
