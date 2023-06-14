/**
 * @jest-environment jsdom
 */
import UnityWebgl from '@lib/src/index'
import * as unityLoaders from '@lib/src/loader'
import 'jest-canvas-mock'

type FuncType = () => void

const config = {
  loaderUrl: 'testLoaderUrl',
  codeUrl: 'testCodeUrl',
  dataUrl: 'testDataUrl',
  frameworkUrl: 'testFrameworkUrl'
}

/**
 * !测试中需要模拟的函数
 * 1. 模拟 unityLoader 方法 (mockLoader)
 * 2. 模拟全局 Unity实例创建函数 `createUnityInstance`
 * 2. 模拟 Unity程序实例 `unityInstance`
 */
const unityInstance = {
  Quit: async () => {}
}
;(window as any).createUnityInstance = async () => unityInstance
/* const unityInstance = {
  Quit: jest.fn().mockReturnValue(Promise.resolve()),
} */
// ;(window as any).createUnityInstance = jest.fn().mockReturnValue(Promise.resolve(unityInstance))

describe('测试UnityWebgl实例方法', () => {
  let canvasElement
  let unityContext
  let bridge = '__UnityLib__'

  let mockLoader
  let loadedFn

  beforeEach(() => {
    loadedFn = jest.fn()
    // !模拟 unityLoader 方法
    mockLoader = jest
      .spyOn(unityLoaders as any, 'default')
      .mockImplementation((_: any, { resolve }: any): FuncType => {
        resolve()
        return loadedFn
      })

    canvasElement = document.createElement('canvas')
    unityContext = new UnityWebgl(canvasElement, config)
  })

  afterEach(() => {
    // 删除bridge属性,避免控制台显示错误信息
    delete window[bridge]

    unityContext = null
    mockLoader.mockRestore()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('初始化&创建Unity实例', async () => {
    expect(unityContext.unityConfig).toEqual({
      ...config,
      companyName: 'Unity',
      productName: 'Unity',
      streamingAssetsUrl: 'StreamingAssets'
    })
    expect(unityContext.bridge).toBe(bridge)
    expect(unityContext.canvasElement).toEqual(canvasElement)
    expect(mockLoader).toHaveBeenCalled()
    expect(mockLoader).toHaveReturnedWith(loadedFn)
    expect(unityContext.unityLoader).toEqual(loadedFn)
    // expect(unityContext.unityInstance).not.toBeNull()
    expect(unityContext.unityInstance).toEqual(unityInstance)
  })

  test('unload() 实例方法', async () => {
    await unityContext.unload()

    expect(loadedFn).toHaveBeenCalled()
    expect(unityContext.unityInstance).toBe(null)
    expect(unityContext.unityLoader).toBe(null)
    expect(unityContext.canvasElement).toBe(null)
    expect((window as any).bridge).toBeUndefined()
  })

  test('reload() 实例方法&事件', async () => {
    const reloadConfig = {
      loaderUrl: 'reloadLoaderUrl',
      codeUrl: 'reloadCodeUrl',
      dataUrl: 'reloadDataUrl',
      frameworkUrl: 'reloadFrameworkUrl'
    }

    const reloadFn = jest.fn()
    unityContext.on('reload', reloadFn)

    unityContext.reload(reloadConfig)

    // expect(unityContext.unityInstance.Quit).toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(reloadFn).toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(unityContext.unityConfig).toEqual({
      ...reloadConfig,
      companyName: 'Unity',
      productName: 'Unity',
      streamingAssetsUrl: 'StreamingAssets'
    })
  })

  test('send() 实例方法', () => {
    unityContext.unityInstance = { SendMessage: jest.fn() }
    unityContext.send('testObject', 'testMethod', { message: 'test' })
    expect(unityContext.unityInstance.SendMessage).toHaveBeenCalledWith(
      'testObject',
      'testMethod',
      '{"message":"test"}'
    )
    // 测试无效调用
    /* unityContext.unityInstance = null
    unityContext.send('testObject', 'testMethod', 'testParam')
    expect(unityContext.unityInstance).toBeNull() */
  })

  test('requestPointerLock() 实例方法', () => {
    const mockRequestPointerLock = jest.fn()
    unityContext.canvasElement = { requestPointerLock: mockRequestPointerLock }
    unityContext.requestPointerLock()
    expect(mockRequestPointerLock).toHaveBeenCalled()
  })

  test('takeScreenshot() 实例方法', () => {
    unityContext.unityConfig.webglContextAttributes = {
      preserveDrawingBuffer: true
    }
    unityContext.canvasElement = {
      toDataURL: () => 'data:image/jpeg;base64,example'
    }
    let result = unityContext.takeScreenshot()
    expect(result).toBe('data:image/jpeg;base64,example')

    // 测试无效调用
    /* unityContext.canvasElement = null
    result = unityContext.takeScreenshot()
    expect(result).toBeUndefined() */
  })

  test('setFullscreen() 实例方法', () => {
    unityContext.unityInstance = { SetFullscreen: jest.fn() }
    unityContext.setFullscreen(true)
    expect(unityContext.unityInstance.SetFullscreen).toHaveBeenCalledWith(1)

    // 测试无效调用
    /* unityContext.unityInstance = null
    unityContext.setFullscreen(true)
    expect(unityContext.unityInstance).toBeNull() */
  })
})

describe('测试UnityWebgl分步创建&周期事件', () => {
  let canvasElement
  let unityContext
  let bridge = '__Unity__'

  let mockLoader
  let loadedFn

  beforeEach(() => {
    canvasElement = document.createElement('canvas')
    unityContext = new UnityWebgl(config, bridge)

    loadedFn = jest.fn()
    //!模拟 unityLoader 方法
    mockLoader = jest
      .spyOn(unityLoaders as any, 'default')
      .mockImplementation((_: any, { resolve }: any): FuncType => {
        resolve()
        return loadedFn
      })
  })
  afterEach(() => {
    // 删除bridge属性,避免控制台显示错误信息
    delete window[bridge]

    unityContext = null
    mockLoader.mockRestore()
    jest.restoreAllMocks()
    jest.clearAllMocks()

    loadedFn = null
  })

  it('初始化配置', () => {
    expect(unityContext.unityConfig).toEqual({
      ...config,
      companyName: 'Unity',
      productName: 'Unity',
      streamingAssetsUrl: 'StreamingAssets'
    })
    expect(unityContext.bridge).toBe(bridge)
    expect(unityContext.canvasElement).toBeNull()
    expect(unityContext.unityLoader).toBeNull()
    expect(unityContext.unityInstance).toBeNull()
  })

  it('create() 实例方法', async () => {
    unityContext.create(canvasElement)

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(unityContext.canvasElement).toEqual(canvasElement)
    expect(mockLoader).toHaveBeenCalled()
    expect(mockLoader).toHaveReturnedWith(loadedFn)
    expect(unityContext.unityLoader).toEqual(loadedFn)
    expect(unityContext.unityInstance).not.toBeNull()
    expect(unityContext.unityInstance).toEqual(unityInstance)
  })

  it('Unity实例从创建到卸载的周期事件', async () => {
    const beforeMountFn = jest.fn()
    const mountedFn = jest.fn()
    const beforeUnmountFn = jest.fn()
    const unmountedFn = jest.fn()
    unityContext.on('beforeMount', beforeMountFn)
    unityContext.on('mounted', mountedFn)
    unityContext.on('beforeUnmount', beforeUnmountFn)
    unityContext.on('unmounted', unmountedFn)

    unityContext.create(canvasElement)
    expect(beforeMountFn).toBeCalled() // beforeMount

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mountedFn).toHaveBeenCalled() // mounted
    unityContext.unload()
    expect(beforeUnmountFn).toBeCalled() // beforeUnmount
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mountedFn).toHaveBeenCalled() // mounted
  })
})

describe('测试UnityWebgl事件机制', () => {
  let unityContext
  let bridge = '__Unity__'

  beforeEach(() => {
    unityContext = new UnityWebgl(config, bridge)
  })
  afterEach(() => {
    delete window[bridge]
  })

  it('on() 实例方法', () => {
    const onFn = jest.fn()
    unityContext.on('click', onFn)
    expect(unityContext._eventMap).toHaveProperty('click')
    expect((window as any)[bridge]).toHaveProperty('click')
  })

  it('emit() 实例方法', () => {
    const clickFn = jest.fn()
    unityContext.on('click', clickFn)
    unityContext.emit('click')
    expect(clickFn).toHaveBeenCalledTimes(1)
    ;(window as any)[bridge].click()
    expect(clickFn).toHaveBeenCalledTimes(2)
  })

  it('off() 实例方法', () => {
    const clickFn = jest.fn()
    unityContext.on('click', clickFn)
    expect(unityContext._eventMap).toHaveProperty('click')
    expect((window as any)[bridge]).toHaveProperty('click')

    unityContext.off('click')
    expect(unityContext._eventMap).not.toHaveProperty('click')
    expect((window as any)[bridge]).not.toHaveProperty('click')
  })

  it('once() 实例方法', () => {
    const clickFn = jest.fn()
    unityContext.once('click', clickFn)
    unityContext.emit('click')
    expect(clickFn).toHaveBeenCalled()
    expect(unityContext._eventMap).not.toHaveProperty('click')

    unityContext.emit('click')
    expect(clickFn).toHaveBeenCalledTimes(1)
  })

  it('clear() 实例方法', () => {
    const clickFn = jest.fn()
    unityContext.on('click', clickFn)
    unityContext.on('move', clickFn)
    expect(unityContext._eventMap).toHaveProperty('click')
    expect(unityContext._eventMap).toHaveProperty('move')

    unityContext.clear()
    expect(unityContext._eventMap).not.toHaveProperty('click')
    expect(unityContext._eventMap).not.toHaveProperty('move')
  })
})
