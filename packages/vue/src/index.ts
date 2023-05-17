import {
  defineComponent,
  PropType,
  ref,
  h,
  isVue2,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue-demi'
import type UnityWebgl from 'unity-webgl'

let unityInstanceIdentifier: number = 0

function cssUnit(val: string | number): string {
  const regx = /^\d+(px|em|%|vw|vh|rem)?$/
  if (typeof val === 'number') {
    return val + 'px'
  } else {
    return regx.test(val)
      ? isNaN(val as unknown as number)
        ? val
        : val + 'px'
      : '100%'
  }
}

export default defineComponent({
  name: 'UnityWebglComponent',
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
  setup(props) {
    const canvas = ref(null)
    unityInstanceIdentifier++

    const canvasStyle = computed(() => {
      return {
        width: cssUnit(props.width),
        height: cssUnit(props.height)
      }
    })

    onMounted(() => {
      if (canvas.value) {
        props.unity?.create(canvas.value)
      }
    })
    onBeforeUnmount(() => {
      props.unity?._unsafe_unload()
    })

    return () =>
      h(
        'canvas',
        isVue2
          ? {
              ref: canvas,
              attrs: {
                id: `unity-canvas-${unityInstanceIdentifier}`
              },
              style: canvasStyle.value
            }
          : {
              ref: canvas,
              id: `unity-canvas-${unityInstanceIdentifier}`,
              style: canvasStyle.value
            }
      )
  }
})
