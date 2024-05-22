<script lang="ts">
import UnityWebgl from 'unity-webgl'
import VueUnity from 'Unity-webgl/vue'

const Unity: UnityWebgl = new UnityWebgl({
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

<template>
  <div id="app">
    <VueUnity :unity="unityContext" width="800" height="600" tabindex="0" />
  </div>
</template>
