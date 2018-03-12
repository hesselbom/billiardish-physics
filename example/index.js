import Physics from '../src/index'

const world = Physics.World()
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const render = () => {
  world.step()
  window.requestAnimationFrame(render)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.lineWidth = 2

  for (let o of world.objects) {
    ctx.beginPath()

    switch (o.type) {
      case 'ball': {
        ctx.arc(o.position.x, o.position.y, o.radius, 0, 2 * Math.PI)
        break
      }
      case 'box': {
        ctx.rect(o.dimensions.x, o.dimensions.y, o.dimensions.w, o.dimensions.h)
        break
      }
    }

    ctx.stroke()
  }

  ctx.translate(canvas.width / -2, canvas.height / -2)
}

world.on('collisionStart', (a, b) => {
  console.log('collision')
})

const ball = Physics.Ball(0, 80, 10)
ball.velocity.y = -8
world.objects.push(ball)
world.objects.push(Physics.Ball(5, -80, 10))
world.objects.push(Physics.Box(0, -160, 500, 40))
world.objects.push(Physics.Box(0, 160, 500, 40))
world.objects.push(Physics.Box(-160, 0, 40, 500))
world.objects.push(Physics.Box(160, 0, 40, 500))

// for (let i = -125; i < 100; i += 22) {
//   for (let j = -80; j < -20; j += 22) {
//     world.objects.push(Physics.Ball(i, j, 10))
//   }
// }

render()
