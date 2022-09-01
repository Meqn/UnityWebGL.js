import { defineComponent, PropType, h, isVue2 } from 'vue-demi'
import UnityWebgl from '../index'

let unityInstanceIdentifier: number = 0

function cssUnit(val: string | number): string {
  const regx = /^\d+(px|em|%|vw|vh|rem)?$/
  if (typeof val === 'number') {
    return val + 'px'
  } else {
    return regx.test(val)
      ? Number.isNaN(val) ? val : val + 'px'
      : '100%'
  }
}

export default defineComponent({
  props: {
    unity: {
      type: Object as PropType<UnityWebgl>
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: '100%'
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: '100%'
    }
  },
  computed: {
    canvasStyle() {
      const { width, height } = this
      return {
        width: cssUnit(width),
        height: cssUnit(height)
      }
    }
  },
  mounted() {
    const htmlCanvasElement = this.$refs.canvas as HTMLCanvasElement
    if (htmlCanvasElement) {
      this.unity?.create(htmlCanvasElement)
    }
  },
  beforeDestroy() {
    this.unity?.destroy()
  },
  render() {
    unityInstanceIdentifier++
    if(isVue2) {
      return h('canvas', {
        ref: 'canvas',
        attrs: {
          id: `unity-canvas-${unityInstanceIdentifier}`
        },
        style: this.canvasStyle
      })
    }
    return h('canvas', {
      ref: 'canvas',
      id: `unity-canvas-${unityInstanceIdentifier}`,
      style: this.canvasStyle
    })
  }
})
