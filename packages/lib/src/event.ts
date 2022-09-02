let UNITY_GLOBAL_NAME: string = '__UnityLib__'
const EventMap = new Map<string, Function>()

export default class EventBus {
  // private globalName: string = '__UnityLib__'
  // private readonly eventMap = new Map<string, Function>()

  constructor() {
    if (window !== undefined) {
      if (window[UNITY_GLOBAL_NAME as keyof Window] === undefined) {
        (window as any)[UNITY_GLOBAL_NAME] = {}
      }
    }
  }
  
  setGlobalName(name: string) {
    if (window[name]) {
      console.error(`UnityWebgl: window.${name} already exists.`)
    } else {
      const oName = UNITY_GLOBAL_NAME
      window[name] = window[UNITY_GLOBAL_NAME]
      UNITY_GLOBAL_NAME = name
      delete window[oName]
    }
  }

  on(eventName: string, eventListener: Function) {
    EventMap.set(eventName, eventListener)
    if (window[UNITY_GLOBAL_NAME as keyof Window] !== undefined) {
      (window as any)[UNITY_GLOBAL_NAME][eventName] = eventListener
    }
    return this
  }

  once(eventName: string, eventListener: Function) {
    const listener = function(this: EventBus) {
      if (eventListener) {
        eventListener.apply(this, arguments)
      }
      this.off(eventName)
    }
    this.on(eventName, listener.bind(this))
    return this
  }

  off(eventName: string) {
    EventMap.delete(eventName)
    if (window[UNITY_GLOBAL_NAME as keyof Window] !== undefined) {
      delete window[UNITY_GLOBAL_NAME as keyof Window][eventName]
    }
    return this
  }

  clear() {
    if (window[UNITY_GLOBAL_NAME as keyof Window] !== undefined) {
      EventMap.forEach((_v, k) => {
        delete window[UNITY_GLOBAL_NAME as keyof Window][k]
      })
    }

    EventMap.clear()
    return this
  }

  emit(eventName: string, ...args: any[]) {
    const event = EventMap.get(eventName)
    if (event !== undefined) {
      event.apply(this, args)
    }
    return this
  }
}
