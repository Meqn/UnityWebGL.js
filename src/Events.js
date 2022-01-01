let UNITY_GLOBAL_NAME = '__UnityLib__'

class EventSystem {
  // event list
  eventMap = new Map()
  
  constructor() {
    if (window !== undefined) {
      if (window[this.global_name] === undefined) {
        window[this.global_name] = {}
      }
    }
  }

  // eslint-disable-next-line camelcase
  get global_name() {
    return UNITY_GLOBAL_NAME
  }

  setGlobalName(name, { allowExist = true, merge = true } = {}) {
    const oName = UNITY_GLOBAL_NAME
    UNITY_GLOBAL_NAME = name
    if (window !== undefined) {
      if (Object.prototype.toString.call(window[name]) !== '[object Object]') {
        window[name] = {}
      }
      if (window[oName]) {
        window[name] = { ...window[oName], ...window[name] }
      }
    }
  }
  
  /**
   * Registers an event to the system.
   * @param {string} eventName event's name
   * @param {function} eventListener event's function
   * @returns 
   */
  on(eventName, eventListener) {
    this.eventMap.set(eventName, eventListener)
    if (window[this.global_name] !== undefined) {
      window[this.global_name][eventName] = eventListener
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

    if (window[this.global_name] !== undefined) {
      delete window[this.global_name][eventName]
    }
    return this
  }
  
  /**
   * Removes all the Event Listeners.
   * @returns 
   */
  clear() {
    if (window[this.global_name] !== undefined) {
      this.eventMap.forEach((_v, k) => {
        delete window[this.global_name][k]
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

export default EventSystem
