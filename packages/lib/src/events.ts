import { msgPrefix } from './utils'

type EventName = string | symbol
type EventHandler = (...args: any[]) => any
type EventMap = Record<EventName, EventHandler>

export default class EventBus {
  constructor(private _eventMap: EventMap = {}) {}

  on(name: EventName, handler: EventHandler) {
    if (typeof handler !== 'function') {
      throw new TypeError(msgPrefix + 'The argument handler must be function')
    }

    this._eventMap[name] = handler
    return this
  }

  off(name: EventName) {
    delete this._eventMap[name]
    return this
  }

  once(name: EventName, handler: EventHandler) {
    const ctx = this
    function fn(...args) {
      if (typeof handler === 'function') {
        ctx.off(name)
        handler.apply(ctx, args)
      }
    }
    return this.on(name, fn)
  }

  emit(name: EventName, ...args: any[]) {
    const handler = this._eventMap[name]
    if (handler) {
      handler.apply(this, args)
    }
  }

  clear() {
    for (const name in this._eventMap) {
      delete this._eventMap[name]
    }
  }
}
