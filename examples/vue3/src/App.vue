<script setup lang="ts">
import UnityWebgl from 'Unity-webgl';
import VueUnity from 'Unity-webgl/vue'

const unityContext: UnityWebgl = new UnityWebgl({
  loaderUrl: 'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.loader.js',
  dataUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.data",
  frameworkUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.framework.js",
  codeUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.wasm",
})

unityContext
  .on('beforeMount', (ctx: UnityWebgl) => {
    console.log('beforeMount', ctx)
  })
  .on('mounted', (ctx: UnityWebgl) => {
    console.log('mounted', ctx)
  })
  .on('beforeUnmount', (ctx: UnityWebgl) => {
    console.log('beforeUnmount', ctx)
  })
  .on('progress', (progress: number) => {
    console.log('loaded : ', progress)
  })

unityContext.on('device', () => alert('click device ......'))
</script>

<template>
<VueUnity :unity="unityContext" width="800" height="600" tabindex="0"></VueUnity>
</template>
