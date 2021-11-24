import Component from './Unity.vue'
import UnityContext from './libs/context'

export { UnityContext }
export default Unity



const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('UnityWebgl', Component)
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(install) // eslint-disable-line
}

export default {
  install,
  UnityContext,
  Component
}
