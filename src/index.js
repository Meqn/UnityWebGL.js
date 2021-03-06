import UnityWebgl from './UnityWebgl.js'
import VueUnity from './Unity.vue'

const install = function(Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('Unity', VueUnity)
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(install) // eslint-disable-line
}

UnityWebgl.install = install
UnityWebgl.component = VueUnity
UnityWebgl.vueComponent = VueUnity
UnityWebgl.VueUnity = VueUnity

// export { VueUnity }
export default UnityWebgl
