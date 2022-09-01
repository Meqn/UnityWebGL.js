import { CanvasElement, IUnityInstanceParameters, IUnityConfig, UnityInstance } from './types'
import EventBus from './event'
import unityLoader from './loader'
import { isPlainObject, queryCanvas } from './utils'

const DefaultConfig = {
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'Unity.com',
  productName: 'Unity'
}

/**
 * generate UnityInstance parameters
 * @param {object} unityContext unityContext
 * @returns 
 */
function generateUnityInstanceParameters(unity: UnityWebgl): IUnityInstanceParameters {
  const unityParameters = { ...unity.unityConfig }
  
  unityParameters.print = function (message: string): void {
    unity.emit('debug', message)
  }

  unityParameters.printError = function (message: string): void {
    unity.emit('error', message)
  }

  return unityParameters
}

export default class UnityWebgl extends EventBus {
  unityConfig: IUnityInstanceParameters
  canvasElement: HTMLCanvasElement | null = null
  unityLoader: (() => void) | null = null
  unityInstance: UnityInstance | null = null

  constructor(options: IUnityConfig)
  constructor(canvas: CanvasElement, options: IUnityConfig)
  constructor(canvas: CanvasElement | IUnityConfig, options?: IUnityConfig) {
    super()

    if (isPlainObject(canvas) && !options) {
      this.unityConfig = Object.assign({}, DefaultConfig, canvas as IUnityConfig)
    } else {
      this.unityConfig = Object.assign({}, DefaultConfig, options)
      const _canvas = queryCanvas(canvas as CanvasElement)
      if (_canvas) {
        this.create(_canvas)
      }
    }
  }

  create(canvas: CanvasElement): void {
    if (this.unityInstance && this.canvasElement && this.unityLoader) {
      console.warn('UnityWebgl: Unity Instance already exists')
      return void 0
    }

    const canvasEl = queryCanvas(canvas)
    if (!canvasEl) {
      console.warn('UnityWebgl: CanvasElement not found.')
      return void 0
    }

    this.canvasElement = canvasEl
    const ctx = this
    const config: IUnityInstanceParameters = generateUnityInstanceParameters(this)

    const loader = unityLoader(config.loaderUrl, {
      resolve() {
        try {
          window.createUnityInstance(
            canvasEl,
            config,
            (val: number) => ctx._setProgression(val)
          ).then((unity: UnityInstance) => {
            ctx.unityInstance = unity 
            ctx.emit('created', unity)
          }).catch((err: Error) => {
            ctx.unityInstance = null
            ctx.emit('error', err)
          })
        } catch (err) {
          ctx.unityInstance = null
          ctx.emit('error', err)
        }
      },
      reject(err) {
        console.error('UnityWebgl: ', err?.message)
      }
    })

    if (typeof loader === 'function') {
      this.unityLoader = loader
    } else {
      console.error()
    }
  }
  
  /**
   * set Progression
   * @param {number} val progress
   */
  private _setProgression(val: number): void {
    if (val === 1) {
      this.emit('loaded')
    }
    this.emit('progress', val)
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param {string} objectName Unity scene name.
   * @param {string} methodName public method name.
   * @param {any} params an optional method parameter.
   * @returns 
   */
   send(objectName: string, methodName: string, params?: string | number | boolean) {
    if (this.unityInstance !== null) {
      if (params === undefined || params === null) {
        this.unityInstance.SendMessage(objectName, methodName)
      } else {
        const _params = typeof params === 'object' ? JSON.stringify(params) : params
        this.unityInstance.SendMessage(objectName, methodName, _params)
      }
    }
    return this
  }

  /**
   * Asynchronously ask for the pointer to be locked on current canvas. To track
   * the success or failure of the request, it is necessary to listen for the
   * pointerlockchange and pointerlockerror events at the Document level.
   * @public
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
   */
   requestPointerLock(): void {
    if (this.canvasElement !== null) {
      this.canvasElement.requestPointerLock()
    }
  }

  /**
   * Takes a screenshot of the canvas and returns a data URL containing image
   * data. The image data is in .png format unless otherwise specified.
   * @param {string} dataType The image format of the screenshot, ["image/png" | "image/jpeg" | "image/webp"]
   * @param {number} quality The quality of the jpg or webp screenshot
   * @returns a data URL containing image data of a snapshot of the canvas
   */
  takeScreenshot(
    dataType: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/jpeg',
    quality?: number
  ): string | null {
    if (this.canvasElement !== null) {
      if (this.unityConfig.webglContextAttributes?.preserveDrawingBuffer !== true) {
        console.warn("Taking a screenshot requires 'preserveDrawingBuffer'.")
      }
      return this.canvasElement.toDataURL(dataType, quality)
    }
    return null
  }

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @param {boolean} enabled 
   */
   setFullscreen(enabled: boolean) {
    if (this.unityInstance !== null) {
      this.unityInstance.SetFullscreen(enabled ? 1 : 0)
    }
  }

  /**
   * Quits the Unity Instance and clears it from memory.
   */
   quitUnityInstance() {
    if (this.unityInstance !== null) {
      this.unityInstance.Quit().then(() => {
        this.unityInstance = null
        this.emit('destroyed')
      })
    }
  }

  /**
   * Destroy Unity Instance
   */
   destroy() {
    if (this.unityLoader) {
      this.unityLoader()
      this.unityLoader = null
    }
    this.quitUnityInstance()
  }
}
