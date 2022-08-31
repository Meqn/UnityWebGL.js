import { IUnityConfig, UnityInstance } from './types'

declare global {
  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param arguments The arguments needed to load Unity.
   * @param onProgress The on progress event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    arguments: IUnityConfig,
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;

  interface Window {
    /**
     * Creates a new UnityInstance.
     * @param canvasHtmlElement The target html canvas element.
     * @param arguments The arguments needed to load Unity.
     * @param onProgress The on progress event listener.
     * @returns A promise resolving when instantiated successfully.
     */
    createUnityInstance: typeof createUnityInstance;
  }
}
