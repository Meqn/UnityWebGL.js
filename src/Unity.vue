<script>
import { generateUnityInstanceParameters, unityLoader } from './libs/utils'
let unityInstanceIdentifier = 0

export default {
  name: 'UnityWebgl',
  props: {
    // The Context which should be rendered be the Unity Component.
    unityContext: Object,
    // The Canvas can appear too blurry on retina screens.
    devicePixelRatio: Number,
    // When disabling the match WebGL to canvas size flag.
    matchWebGLToCanvasSize: {
      type: Boolean,
      default: undefined
    }
  },
  mounted() {
    const { unityContext } = this

    const unityInstanceParameters = generateUnityInstanceParameters(unityContext, this.$props)

    const htmlCanvasElement = this.$refs.canvas
    if (htmlCanvasElement) {
      unityContext.htmlCanvasElement = htmlCanvasElement
    }

    const ctx = this
    this.unityLoader = unityLoader(unityInstanceParameters.loaderUrl, {
      resolve() {
        try {
          window.createUnityInstance(
            htmlCanvasElement,
            unityInstanceParameters,
            ctx.setProgression
          ).then(unity => {
            unityContext.unityInstance = unity
          }).catch(err => {
            unityContext.dispatch('error', err)
            unityContext.unityInstance = null
          })
        } catch (err) {
          unityContext.dispatch('error', err)
          unityContext.unityInstance = null
        }
      }
    })
  },
  render(h) {
    unityInstanceIdentifier++

    return h('canvas', {
      ref: 'canvas',
      attrs: {
        id: `unity-canvas-${unityInstanceIdentifier}`
      },
      style: {
        width: '100%',
        height: '100%'
      }
    })
  },
  beforeDestroy() {
    const { unityLoader, unityContext } = this
    // remove unityLoader
    unityLoader && unityLoader()
    // detroy Unity instance
    unityContext.quitUnityInstance && unityContext.quitUnityInstance()
  },
  methods: {
    setProgression(val) {
      const { unityContext } = this
      if (val === 1) {
        unityContext.dispatch('loaded')
      }
      unityContext.dispatch('progress', val)
    }
  }
}
</script>
