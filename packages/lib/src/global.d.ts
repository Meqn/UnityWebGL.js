import { IUnityArguments, UnityInstance } from './types'

declare global {
  /**
   * Creates a new UnityInstance.
   * @param canvas The target html canvas element.
   * @param config The config object contains the build configuration.
   * @param onProgress The on progress event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvas: HTMLCanvasElement,
    config: IUnityArguments,
    onProgress?: (progress: number) => void
  ): Promise<UnityInstance>

  /**
   * Due to some developers wanting to use the window object as a global scope
   * in order to invoke the create Unity Instance and dispatch React Unity Event
   * functions, we need to declare the window object as a global type.
   */
  interface Window {
    /**
     * Creates a new UnityInstance.
     * @param canvasHtmlElement The target html canvas element.
     * @param arguments The arguments needed to load Unity.
     * @param onProgress The on progress event listener.
     * @returns A promise resolving when instantiated successfully.
     */
    createUnityInstance: typeof createUnityInstance
  }
}

export {}
