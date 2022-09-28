<script setup lang="ts">
import UnityWebgl from 'Unity-webgl';
import VueUnity from 'Unity-webgl/vue'

const Unity: UnityWebgl = new UnityWebgl({
  loaderUrl: 'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.loader.js',
  dataUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.data",
  frameworkUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.framework.js",
  codeUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.wasm",
})

Unity.on('device', () => alert('click device ...'))
</script>

<template>
<VueUnity :unity="Unity" width="800" height="600"></VueUnity>
</template>
