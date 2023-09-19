import type {
  CanvasElement,
  IUnityConfig,
  IUnityArguments,
  UnityInstance
} from './types'
import EventBus from './events'
import unityLoader from './loader'
import { isBrowser, msgPrefix, log, isPlainObject, queryCanvas } from './utils'

let BRIDGE_NAME = '__UnityLib__'
const defaultConfig = {
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'Unity',
  productName: 'Unity'
}

/**
 * generate UnityInstance arguments
 * @param {object} unityContext unityContext
 * @returns
 */
function generateUnityArguments(unity: UnityWebgl): IUnityArguments {
  const unityInstanceArgs: IUnityArguments = { ...unity.unityConfig }

  unityInstanceArgs.print = function (message: string): void {
    unity.emit('debug', message)
  }

  unityInstanceArgs.printError = function (message: string): void {
    unity.emit('error', message)
  }

  // delete unityInstanceArgs['lodaderUrl']
  return unityInstanceArgs
}

/**
 * UnityWebgl
 * // new UnityWebgl(canvasElement, unityConfig, bridge)
 */
export default class UnityWebgl extends EventBus {
  unityConfig: IUnityConfig
  canvasElement: HTMLCanvasElement | null = null
  unityLoader: (() => void) | null = null
  unityInstance: UnityInstance | null = null

  /**
   * UnityWebgl constructor
   * @param canvas htmlCanvasElement
   * @param config configuration
   * @param bridge Bridge name, global communication collector.
   */
  constructor(config: IUnityConfig, bridge?: string)
  constructor(canvas: CanvasElement, config: IUnityConfig, bridge?: string)
  constructor(
    canvas: CanvasElement | IUnityConfig,
    config?: IUnityConfig | string,
    bridge?: string
  ) {
    let window
    window = globalThis || window
    bridge = bridge ?? BRIDGE_NAME
    if (isPlainObject(canvas) && typeof config === 'string') {
      bridge = config || bridge
    }
    if (bridge in window) {
      log.error(msgPrefix + `window.${bridge} already exists.`)
    }
    BRIDGE_NAME = bridge
    super((window[bridge] = {}))

    if (isPlainObject(canvas)) {
      this.unityConfig = Object.assign(
        {},
        defaultConfig,
        canvas as IUnityConfig
      )
    } else {
      this.unityConfig = Object.assign(
        {},
        defaultConfig,
        config as IUnityConfig
      )
      const $canvas = queryCanvas(canvas as CanvasElement)
      if ($canvas) {
        this.create($canvas)
      }
    }
  }

  get bridge() {
    return BRIDGE_NAME
  }
  set bridge(name) {
    window[name] = window[BRIDGE_NAME]
    delete window[BRIDGE_NAME]
    BRIDGE_NAME = name
  }

  /**
   * 创建 Unity应用实例并渲染至画布
   * @param canvas 画布
   * @returns
   */
  create(canvas: CanvasElement): void {
    if (!isBrowser) return
    if (this.unityInstance && this.canvasElement && this.unityLoader) {
      log.warn('Unity Instance already exists!')
      return void 0
    }

    const canvasElement = queryCanvas(canvas)
    if (!canvasElement) {
      log.warn('CanvasElement not found.')
      return void 0
    }

    this.canvasElement = canvasElement
    const ctx = this
    const unityArguments: IUnityArguments = generateUnityArguments(this)

    this.emit('beforeMount', this)

    this.unityLoader = unityLoader(this.unityConfig.loaderUrl, {
      resolve() {
        try {
          // Creates the Unity Instance, this method is made available globally by the Unity Loader.
          window
            .createUnityInstance(canvasElement, unityArguments, (val: number) =>
              ctx.emit('progress', val)
            )
            .then((unity: UnityInstance) => {
              ctx.unityInstance = unity
              ctx.emit('created', unity) // todo 待删除
              ctx.emit('mounted', ctx)
            })
            .catch((err: Error) => {
              ctx.unityInstance = null
              ctx.emit('error', err)
            })
        } catch (err) {
          ctx.unityInstance = null
          ctx.emit('error', err)
        }
      },
      reject(e) {
        log.error((<Error>e).message)
      }
    }) as () => void
  }

  /**
   * 销毁并重新加载Unity应用
   * @param config 配置项
   */
  reload(config?: IUnityConfig): void {
    const canvasElement =
      this.canvasElement || this.unityInstance?.Module?.canvas

    if (this.unityInstance && canvasElement) {
      this.unityInstance.Quit().then(() => {
        this.unityLoader = null
        this.unityConfig = Object.assign({}, this.unityConfig, config)

        this.emit('reload', this)
        this.create(canvasElement)
      })
    }
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param {string} objectName Unity scene name.
   * @param {string} methodName public method name.
   * @param {any} params an optional method parameter.
   * @returns
   */
  send(objectName: string, methodName: string, params?: any) {
    if (this.unityInstance) {
      if (params === undefined || params === null) {
        this.unityInstance.SendMessage(objectName, methodName)
      } else {
        const _params =
          typeof params === 'object' ? JSON.stringify(params) : params
        this.unityInstance.SendMessage(objectName, methodName, _params)
      }
    } else {
      log.warn('Unable to Send Message while Unity is not Instantiated.')
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
    const canvasElement =
      this.canvasElement || this.unityInstance?.Module?.canvas
    if (canvasElement) {
      canvasElement.requestPointerLock()
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
  ): string | undefined {
    const canvasElement =
      this.canvasElement || this.unityInstance?.Module?.canvas
    if (!canvasElement) {
      log.warn(
        'Unable to Take Screenshot while Unity is not Instantiated or Canvas is not available.'
      )
      return
    }
    if (
      this.unityConfig.webglContextAttributes?.preserveDrawingBuffer !== true
    ) {
      log.warn('Taking a screenshot requires "preserveDrawingBuffer".')
    }
    // Takes a screenshot by converting Canvas's render-context's buffer into
    // a Data URL of the specified data type and quality.
    return canvasElement.toDataURL(dataType, quality)
  }

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @param {boolean} enabled
   */
  setFullscreen(enabled: boolean) {
    if (!this.unityInstance) {
      // Guarding the Unity Instance.
      log.warn('Unable to Set Fullscreen while Unity is not Instantiated.')
      return
    }

    this.unityInstance.SetFullscreen(enabled ? 1 : 0)
  }

  /**
   * Quits the Unity instance and clears it from memory so that Unmount from the DOM.
   */
  unload(): Promise<void> {
    if (this.unityInstance === null) {
      // Guarding the Unity Instance.
      log.warn('Unable to Quit Unity while Unity is not Instantiated.')
      return Promise.reject()
    }
    this.emit('beforeUnmount', this)

    // Unmount unity.loader.js from the DOM
    if (typeof this.unityLoader === 'function') {
      this.unityLoader()
      this.unityLoader = null
    }
    return this.unityInstance.Quit().then(() => {
      this.emit('unmounted')
      this.emit('destroyed') // todo 待删除

      this.unityInstance = null
      this.canvasElement = null
      // Clear all events
      // this.clear()
      delete window[BRIDGE_NAME]
    })
  }

  /**
   * Detatches the Unity Instance from the React DOM, by doing so, the Unity
   * Instance can be unloaded from the memory while the Unity component can be
   * unmounted safely.
   *
   * Warning! This is a workaround for the fact that the Unity WebGL instances
   * which are build with Unity 2021.2 and newer cannot be unmounted before the
   * Unity Instance is unloaded.
   */
  _unsafe_unload(): Promise<void> {
    try {
      if (this.unityInstance === null || !this.unityInstance.Module.canvas) {
        // Guarding the Unity Instance.
        log.warn('No Unity Instance found.')
        return Promise.reject()
      }
      // Re-attaches the canvas to the body element of the document. This way it
      // wont be removed from the DOM when the component is unmounted. Then the
      // canvas will be hidden while it is being unloaded.
      const canvas = this.unityInstance.Module.canvas as HTMLCanvasElement
      document.body.appendChild(canvas)
      canvas.style.display = 'none'
      // Unloads the Unity Instance.
      return this.unload().then(() => {
        // Eventually the canvas will be removed from the DOM. This has to be done
        // manually since the canvas is no longer controlled by the React DOM.
        canvas.remove()
      })
    } catch (e) {
      log.error((<Error>e).message)
      return Promise.reject(e)
    }
  }
}
