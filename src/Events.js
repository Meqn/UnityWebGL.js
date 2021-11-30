// const UNITY_GLOBAL_NAME = 'UnityWebGL'
const UNITY_GLOBAL_NAME = '__UnityLib__'

class EventSystem {
  // event list
  eventMap = new Map()
  
  constructor() {
    if (window !== undefined) {
      if (window[UNITY_GLOBAL_NAME] === undefined) {
        window[UNITY_GLOBAL_NAME] = {}
      }
    }
  }

  get global_name() {
    return UNITY_GLOBAL_NAME
  }
  
  /**
   * Registers an event to the system.
   * @param {string} eventName event's name
   * @param {function} eventListener event's function
   * @returns 
   */
  on(eventName, eventListener) {
    this.eventMap.set(eventName, eventListener)
    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      window[UNITY_GLOBAL_NAME][eventName] = eventListener
    }
    return this
  }
  
  /**
   * Registers an event and it only run one time
   * @param {string} eventName event's name
   * @param {function} eventListener event's function
   * @returns 
   */
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
  
  /**
   * Removes all the Event Listeners with a specific Event Name.
   * @param {string} eventName event's name
   * @returns 
   */
  off(eventName) {
    this.eventMap.delete(eventName)

    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      delete window[UNITY_GLOBAL_NAME][eventName]
    }
    return this
  }
  
  /**
   * Removes all the Event Listeners.
   * @returns 
   */
  clear() {
    if (window[UNITY_GLOBAL_NAME] !== undefined) {
      this.eventMap.forEach((_v, k) => {
        delete window[UNITY_GLOBAL_NAME][k]
      })
    }

    this.eventMap.clear()
    return this
  }
  
  /**
   * Dispatches an event that has been registered to the event system.
   * @param {string} eventName event's name
   * @param  {...any} args event's parameters
   * @returns 
   */
  emit(eventName, ...args) {
    const event = this.eventMap.get(eventName)
    if (event !== undefined) {
      event(...args)
    }
    return this
  }
}

EventSystem.global_name = UNITY_GLOBAL_NAME

export default EventSystem
