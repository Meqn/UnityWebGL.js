import VueComponent from './component.js'
import Component from './component.vue'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('VueComponent', Component)
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(install) // eslint-disable-line
}

VueComponent.install = install
VueComponent.component = Component

export default VueComponent
