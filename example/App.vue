<template>
  <div id="app">
    <Unity :unity="unityContext" width="800px" heighht="600px" />
  </div>
</template>

<script>
// import UnityWebgl from 'unity-webgl'
import UnityWebgl from '../dist/UnityWebgl.esm'

const Unity = new UnityWebgl({
  loaderUrl: 'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.loader.js',
  dataUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.data",
  frameworkUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.framework.js",
  codeUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

export default {
  name: 'App',
  components: {
    Unity: UnityWebgl.vueComponent
  },
  data() {
    return {
      unityContext: Unity
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
