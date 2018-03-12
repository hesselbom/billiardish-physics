import Collision from './Collision'

export default () => ({
  objects: [],
  listeners: {},
  step: function () {
    for (let obj of this.objects) {
      if (obj.velocity) {
        obj.position.x += obj.velocity.x
        obj.position.y += obj.velocity.y

        obj.velocity.x *= obj.drag
        obj.velocity.y *= obj.drag
      }
    }

    Collision.test(this.objects, this.listeners)
  },
  on: function (event, callback) {
    this.listeners[event] = [].concat(this.listeners[event] || [], callback)
  }
})
