import Vue from 'vue'
import isFunction from 'lodash/isFunction'

export default class VueComponent {
  static version = '1.0.0'
  constructor (name, options = {}) {
    this.name = name
    this.opts = options
  }

  install (component) {
    if ('use' in Vue) {
      Vue.use(component)
    }
    Vue.use(component)
  }

  mounted () {
    const { mounted } = this.opts
    if (isFunction(mounted)) {
      mounted()
    }
  }
}
