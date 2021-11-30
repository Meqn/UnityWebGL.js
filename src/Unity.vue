<script>
let unityInstanceIdentifier = 0

function cssUnit(val) {
  const regx = /^\d+(px|em|%|vw|vh|rem)?$/
  if (regx.test(val)) {
    return isNaN(val) ? val : val + 'px'
  }
  return ''
}

export default {
  name: 'UnityWebgl',
  props: {
    unity: Object,
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
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
    const htmlCanvasElement = this.$refs.canvas
    const { unity } = this
    if (htmlCanvasElement) {
      unity?.create(htmlCanvasElement)
    }
    this.$once('hook:beforeDestroy', () => {
      unity?.destroy()
    })
  },
  render(h) {
    unityInstanceIdentifier++

    return h('canvas', {
      ref: 'canvas',
      attrs: {
        id: `unity-canvas-${unityInstanceIdentifier}`
      },
      style: this.canvasStyle
    })
  }
}
</script>
