const UNITY_GLOBAL_NAME = 'UnityWebGL'

class EventSystem {
  eventMap = new Map()
  global_name = UNITY_GLOBAL_NAME
  
  constructor() {
    if (window[UNITY_GLOBAL_NAME] === undefined) {
      window[UNITY_GLOBAL_NAME] = {}
    }
  }

  on(eventName, eventListener) {
    this.eventMap.set(eventName, eventListener)
    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      window[UNITY_GLOBAL_NAME][eventName] = eventListener
    }
    return this
  }

  once(eventName, eventListener) {
    const listener = function() {
      if (eventListener) {
        eventListener.apply(this, arguments)
      }
      this.off(eventName, listener)
    }
    this.on(eventName, listener.bind(this))
    return this
  }

  off(eventName) {
    this.eventMap.delete(eventName)

    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      delete window[UNITY_GLOBAL_NAME][eventName]
    }
    return this
  }

  clear() {
    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      this.eventMap.forEach((_v, k) => {
        delete window[UNITY_GLOBAL_NAME][k]
      })
    }

    this.eventMap.clear()
    return this
  }

  dispatch(eventName, ...args) {
    const event = this.eventMap.get(eventName)
    if (event !== undefined) {
      event(...args)
    }
    return this
  }
}

EventSystem.global_name = UNITY_GLOBAL_NAME

export default EventSystem
