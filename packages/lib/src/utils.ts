import { type CanvasElement } from './types'

export const isPlainObject: (arg: any) => boolean = arg => Object.prototype.toString.call(arg) === '[object Object]'

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
    console.warn('UnityWebgl: CanvasElement not found.')
    return null
  }
}
