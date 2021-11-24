/**
 * The unity loader
 * @param {string} src loaderUrl
 * @param {object} param callback
 * @returns 
 */
export function unityLoader(src, { resolve, reject }) {
  if (!src) {
    reject && reject(new Error('UnityLoader: src not found.'))
    return null
  }

  function handler(code) {
    if (code === 'ready') {
      resolve && resolve()
    } else {
      reject && reject(new Error(`'UnityLoader: ${src}' load failed.`))
    }
  }

  let script = document.querySelector(`script[src="${src}"]`)
  if (script === null) {
    script = document.createElement('script')
    script.src = src
    script.async = true
    script.setAttribute('data-status', 'loading')

    document.body.appendChild(script)

    const setAttributeFromEvent = function(event) {
      const _status = event.type === 'load' ? 'ready' : 'error'
      script?.setAttribute('data-status', _status)
      // handler(_status)
    }

    script.addEventListener('load', setAttributeFromEvent)
    script.addEventListener('error', setAttributeFromEvent)
  } else {
    handler(script.getAttribute('data-status'))
  }

  const setStateFromEvent = function(event) {
    handler(event.type === 'load' ? 'ready' : 'error')
  }

  script.addEventListener('load', setStateFromEvent)
  script.addEventListener('error', setStateFromEvent)

  return function() {
    if (script) {
      script.removeEventListener('load', setStateFromEvent)
      script.removeEventListener('error', setStateFromEvent)
      document.body.removeChild(script)
    }
  }
}

/**
 * 
 * @param {object} unityContext 
 * @param {object} unityProps 
 * @returns 
 */
export function generateUnityInstanceParameters(unityContext, unityProps) {
  const unityParameters = { ...unityContext.unityConfig }
  const { devicePixelRatio, matchWebGLToCanvasSize } = unityProps
  
  unityParameters.print = function (message) {
    unityContext.dispatch('debug', message)
  }

  unityParameters.printErr = function (message) {
    unityContext.dispatch('error', message)
  }

  if (devicePixelRatio !== undefined) {
    unityParameters.devicePixelRatio = devicePixelRatio
  }

  if (matchWebGLToCanvasSize !== undefined) {
    unityParameters.matchWebGLToCanvasSize = matchWebGLToCanvasSize
  }

  return unityParameters
}
