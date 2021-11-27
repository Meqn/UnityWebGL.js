<script>
let unityInstanceIdentifier = 0

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
        width: width + (typeof width === 'number' ? 'px' : ''),
        height: height + (typeof height === 'number' ? 'px' : '')
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
