import UnityWebgl from '../../packages/lib/dist/UnityWebgl.esm.js'

var Unity = new UnityWebgl('#canvas', {
  loaderUrl: 'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.loader.js',
  dataUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.data",
  frameworkUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.framework.js",
  codeUrl: "https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/unity/test1/Build/OUT_BIM.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "BIM",
  productVersion: "0.1",
})

Unity
  .on('progress', percent => console.log('Unity progress: ', percent))
  .on('loaded', percent => console.log('Unity loaded: success'))
  .on('created', percent => console.log('Unity created: success'))

