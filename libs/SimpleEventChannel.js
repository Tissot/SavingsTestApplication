'use strict'

class SimpleEventChannel {
  constructor() {
    this.events = Object.create(null)
  }

  on(type, listener) {
    this.events[type] = this.events[type] || []
    this.events[type].push(listener)
    return this
  }

  emit(type, ...args) {
    if (this.events[type]) {
      for (let i = 0; i < this.events[type].length; ++i) {
        this.events[type][i](...args)
      }
    }
  }

  off(type, listener) {
    for (let i = this.events[type].length - 1; i >= 0; --i) {
      if (this.events[type][i] === listener) {
        this.events[type].splice(i , 1)
        break
      }
    }
    return this
  }
}

export default new SimpleEventChannel()