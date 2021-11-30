# unity-webgl

Unity WebGL provides an easy solution for embedding Unity WebGL builds in your webApp or Vue.js project, with two-way communication between your webApp and Unity application with advanced API's.   

UnityWebGL.js 提供了一种简单的解决方案，用于在 webApp 或 Vue.js 项目中嵌入 Unity WebGL，并通过API在 webApp 和 Unity 之间进行双向通信。

based on [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)

## features
- Simple and flexible to use
- two-way communication (webApp, Unity)
- Built-in event handler
- Available for Vue.js

## Install
```
npm install unity-webgl
```

browser
```
https://cdn.jsdelivr.net/npm/unity-webgl/dist/UnityWebgl.min.js
```

## Usage

in example.html:

```html
<canvas id="canvas" style="width: 100%; height: 100%"></canvas>

<button onclick="onDestroy()">Destroy</button>
<button onclick="onLoad()">Reload</button>
<button onclick="onFullscreen()">Fullscreen</button>

<script>
var Unity = new UnityWebgl.default('#canvas', {
  loaderUrl: 'Build/OUT_BIM.loader.js',
  dataUrl: "Build/OUT_BIM.data",
  frameworkUrl: "Build/OUT_BIM.framework.js",
  codeUrl: "Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

Unity
  .on('progress', percent => console.log('Unity Loaded: ', percent))
  .on('created', () => console.log('Unity Instance: created.'))
  .on('destroyed', () => console.log('Unity Instance: Destroyed.'))

function postMessage() {
  Unity.send('objectName', 'methodName', {
    id: 'B0001',
    name: 'Building#1',
    location: [150, 75]
  })
}

function onDestroy() {
  Unity.destroy()
}

function onLoad() {
  Unity.create('#canvas')
}

function onFullscreen() {
  Unity.setFullscreen(true)
}
</script>
```

You can also:

```js
var Unity = new UnityWebgl.default({
  loaderUrl: 'Build/OUT_BIM.loader.js',
  dataUrl: "Build/OUT_BIM.data",
  frameworkUrl: "Build/OUT_BIM.framework.js",
  codeUrl: "Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

Unity.create(document.querySelector('#canvas'))
```

### Vue

in example.vue

```html
<template>
  <Unity :unity="unityContext" width="800px" heighht="600px" />
</template>

<script>
import UnityWebgl, { VueUnity } from 'unity-webgl'

const Unity = new UnityWebgl({
  loaderUrl: 'Build/OUT_BIM.loader.js',
  dataUrl: "Build/OUT_BIM.data",
  frameworkUrl: "Build/OUT_BIM.framework.js",
  codeUrl: "Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

export default {
  name: 'Unity',
  component: {
    Unity: VueUnity
  },
  data() {
    return {
      unityContext: Unity
    }
  }
}
</script>
```


## Methods

events:
* `on(eventName: string, eventListener: function)`
* `once(eventName: string, eventListener: function)`
* `off(eventName: string)`
* `clear()`
* `emit(eventName: string)`

instance:
* `create(canvasElement: HTMLCanvasElement | string)`
* `send(objectName: string, methodName: string, params: any)`
* `setFullscreen()`
* `destroy()`


## Events

- `progress(value: number)` : loading progress.
- `loaded()` : loading completed.
- `created()` : Unity instance is created.
- `destroyed()` : Quits the Unity Instance and clears it from memory.


## Communication

1. Unity application call js functions.  
  在Unity中调用js方法。

```js
// # in Unity
// Call the `showDialog` method in unity.
__UnityLib__.showDialog(data)

// 📢 `__UnityLib__` is a global function collection.
```

```js
// # in webApp

const Unity = new UnityWebgl.default()

// Register functions
Unity.on('showDialog', (data: any) => {
  console.log(data)
  $('#dialog').show()
})

// you also can call function.
Unity.emit('showDialog', data)
// or
window[Unity.global_name].showDialog(data) // 📢 Unity.global_name = __UnityLib__

```



2. JS call Unity public methods.  
  在web页面内调用 Unity public方法。

```js
/**
 * Sends a message to the UnityInstance to invoke a public method.
 * @param {string} objectName Unity scene name.
 * @param {string} methodName public method name.
 * @param {any} params an optional method parameter.
 */
Unity.send(objectName, methodName, params)

// e.g. Initialize Building#001 data
Unity.send('mainScene', 'init', {
  id: 'b001',
  name: 'building#001',
  length: 95,
  width: 27,
  height: 120
})
```

