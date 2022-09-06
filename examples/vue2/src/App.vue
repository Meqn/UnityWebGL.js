<template>
  <div id="app">
    <VueUnity :unity="unityContext" width="800" heighht="600" />
  </div>
</template>

<script>
  import UnityWebgl from 'unity-webgl'
  import VueUnity from 'Unity-webgl/vue'

  const Unity = new UnityWebgl({
    loaderUrl: 'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.loader.js',
    dataUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.data",
    frameworkUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.framework.js",
    codeUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.wasm",
  })

  Unity.on('device', () => alert('click device ...'))

  export default {
    name: 'App',
    components: {
      VueUnity
    },
    data() {
      return {
        unityContext: Unity
      }
    }
  }
  </script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
