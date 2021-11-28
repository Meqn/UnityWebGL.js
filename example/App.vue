<template>
  <div id="app">
    <Unity :unity="unityContext" width="800px" heighht="600px" />
  </div>
</template>

<script>
import UnityWebgl, { VueUnity } from 'unity-webgl'

const Unity = new UnityWebgl({
  loaderUrl: '/Build/OUT_BIM.loader.js',
  dataUrl: "/Build/OUT_BIM.data",
  frameworkUrl: "/Build/OUT_BIM.framework.js",
  codeUrl: "/Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

export default {
  name: 'App',
  components: {
    Unity: VueUnity
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
