import { msgPrefix, isBrowser } from './utils'

type ScriptLoadedStatus = 'load' | 'ready' | 'error' | null

interface IUnityLoaderCallbackObj {
  resolve: () => void
  reject: (error?: Error) => void
}

/**
 * The unity loader
 * @param {string} src loaderUrl
 * @param {object} callbackObj callbackObj
 * @param {Function} callbackObj.resolve resolve
 * @param {Function} callbackObj.reject reject
 * @returns
 */
export default function unityLoader(
  src: string,
  { resolve, reject }: IUnityLoaderCallbackObj
): (() => void) | void {
  if (!isBrowser) return
  if (!src) {
    reject && reject(new Error(`${msgPrefix} loaderUrl not found.`))
    return
  }

  /* if (typeof window.createUnityInstance === 'function') {
    log('Unity Loader already exists')
    resolve && resolve()
    return
  } */

  function handler(code: ScriptLoadedStatus) {
    if (code === 'ready') {
      resolve && resolve()
    } else {
      reject && reject(new Error(`${msgPrefix} ${src} loading failure.`))
    }
  }

  let script: HTMLScriptElement | null = window.document.querySelector(
    `script[src="${src}"]`
  )
  if (script === null) {
    script = window.document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.async = true
    script.setAttribute('data-status', 'loading')

    window.document.body.appendChild(script)

    const setAttributeFromEvent = function (event: Event) {
      const _status = event.type === 'load' ? 'ready' : 'error'
      script?.setAttribute('data-status', _status)
      // handler(_status)
    }

    script.addEventListener('load', setAttributeFromEvent)
    script.addEventListener('error', setAttributeFromEvent)
  } else {
    handler(script.getAttribute('data-status') as ScriptLoadedStatus)
  }

  const setStateFromEvent = function (event: Event) {
    handler(event.type === 'load' ? 'ready' : 'error')
  }

  script.addEventListener('load', setStateFromEvent)
  script.addEventListener('error', setStateFromEvent)

  return function () {
    if (script) {
      script.removeEventListener('load', setStateFromEvent)
      script.removeEventListener('error', setStateFromEvent)
      window.document.body.removeChild(script)
    }
  }
}
