import V from './Vector'
import Pair from './Pair'

let Collision = {}

const velocityFromSurfaceNormal = (n, v) => {
  // From https://stackoverflow.com/a/573206/511949
  const u = V.multScalar(n, (V.dot(v, n) / V.dot(n, n)))
  const w = V.sub(v, u)

  return V.sub(w, u)
}

Collision.testBallToBall = (a, b) => (
  V.distanceSquared(a.position, b.position) < (a.radius + b.radius) * (a.radius + b.radius)
)

Collision.resolveBallToBall = (a, b, listeners) => {
  const delta = V.sub(a.position, b.position)
  const d = V.magnitude(delta)

  // minimum translation distance to push balls apart after intersecting
  const mtd = V.multScalar(delta, ((a.radius + b.radius) - d) / d)

  // push-pull them apart based off their mass
  a.position = V.add(a.position, V.multScalar(mtd, a.invMass / (a.invMass + b.invMass)))
  b.position = V.sub(b.position, V.multScalar(mtd, b.invMass / (a.invMass + b.invMass)))

  // impact speed
  const v = V.sub(a.velocity, b.velocity)
  const vn = V.dot(v, V.normalize(mtd))

  // sphere intersecting but moving away from each other already
  if (vn > 0) return

  // collision impulse
  // const restitution = 1
  // const impulse = V.multScalar(mtd, (-restitution * vn) / (a.invMass + b.invMass))
  const impulse = mtd

  // change in momentum
  a.velocity = V.add(a.velocity, V.multScalar(impulse, a.invMass))
  b.velocity = V.sub(b.velocity, V.multScalar(impulse, b.invMass))
}

Collision.testBallToBox = (ball, box) => {
  // Point clamped to box
  const cx = Math.max(Math.min(ball.position.x, box.dimensions.x + box.dimensions.w), box.dimensions.x)
  const cy = Math.max(Math.min(ball.position.y, box.dimensions.y + box.dimensions.h), box.dimensions.y)
  const distSquared = (ball.position.x - cx) * (ball.position.x - cx) + (ball.position.y - cy) * (ball.position.y - cy)

  return distSquared < ball.radiusSquared
}

Collision.resolveBallToBox = (ball, box) => {
  // Point clamped to box
  const cx = Math.max(Math.min(ball.position.x, box.dimensions.x + box.dimensions.w), box.dimensions.x)
  const cy = Math.max(Math.min(ball.position.y, box.dimensions.y + box.dimensions.h), box.dimensions.y)
  const v = { x: ball.position.x - cx, y: ball.position.y - cy }
  const dist = V.magnitude(v)
  const surfaceNormal = V.normalize(v)
  const push = V.multScalar(surfaceNormal, ball.radius - dist)

  ball.velocity = velocityFromSurfaceNormal(surfaceNormal, ball.velocity)
  ball.position = V.add(ball.position, push)
}

Collision.testBallToBoundaryCircle = (ball, boundary) => (
  V.magnitudeSquared(ball.position) > (boundary.radius - ball.radius) * (boundary.radius - ball.radius)
)

Collision.resolveBallToBoundaryCircle = (ball, boundary) => {
  const surfaceNormal = V.normalize({ x: -ball.position.x, y: -ball.position.y })
  ball.velocity = velocityFromSurfaceNormal(surfaceNormal, ball.velocity)

  ball.position = V.clamp(ball.position, 0, boundary.radius - ball.radius)
}

Collision.test = (objects, listeners) => {
  let activePairIds = []

  for (let a of objects) {
    for (let b of objects) {
      if (a === b) continue

      if (a.type === 'ball' && b.type === 'ball') {
        if ((a.collisionFilter.category & b.collisionFilter.mask) !== 0 && (b.collisionFilter.category & a.collisionFilter.mask) !== 0) {
          if (Collision.testBallToBall(a, b)) {
            if (!Pair.isActive(a, b)) {
              if (listeners['collisionStart']) {
                listeners['collisionStart'].forEach(cb => cb(a, b))
              }
              Pair.setActive(a, b, true)
            }

            Collision.resolveBallToBall(a, b, listeners)

            activePairIds.push(Pair.id(a, b))
          }
        }
      } else if (a.type === 'ball' && b.type === 'boundary-circle') {
        if (Collision.testBallToBoundaryCircle(a, b)) {
          Collision.resolveBallToBoundaryCircle(a, b)
        }
      } else if (a.type === 'ball' && b.type === 'box') {
        if (Collision.testBallToBox(a, b)) {
          Collision.resolveBallToBox(a, b)
        }
      }
    }
  }

  const inactivated = Pair.getInactivated(activePairIds)

  for (let i = 0; i < inactivated.length; i++) {
    const { a, b } = inactivated[i]
    if (listeners['collisionEnd']) {
      listeners['collisionEnd'].forEach(cb => cb(a, b))
    }
  }
}

export default Collision
