let Vector = {}

Vector.add = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y
})

Vector.sub = (a, b) => ({
  x: a.x - b.x,
  y: a.y - b.y
})

Vector.mult = (a, b) => ({
  x: a.x * b.x,
  y: a.y * b.y
})

Vector.multScalar = (a, scalar) => ({
  x: a.x * scalar,
  y: a.y * scalar
})

Vector.div = (a, b) => ({
  x: a.x / b.x,
  y: a.y / b.y
})

Vector.divScalar = (a, scalar) => ({
  x: a.x / scalar,
  y: a.y / scalar
})

Vector.magnitude = (vector) => (
  Math.sqrt((vector.x * vector.x) + (vector.y * vector.y))
)

Vector.magnitudeSquared = (vector) => (
  (vector.x * vector.x) + (vector.y * vector.y)
)

Vector.distance = (a, b) => (
  Math.sqrt(Vector.distanceSquared(a, b))
)

Vector.distanceSquared = (a, b) => {
  let v = { x: b.x - a.x, y: b.y - a.y }
  return Vector.magnitudeSquared(v)
}

Vector.normalize = (v) => {
  const magnitude = Vector.magnitude(v)
  if (magnitude === 0) return { x: 0, y: 0 }
  return { x: v.x / magnitude, y: v.y / magnitude }
}

Vector.dot = (a, b) => (
  (a.x * b.x) + (a.y * b.y)
)

Vector.lerp = (a, b, alpha) => (
  Vector.add(
    a,
    Vector.multScalar(
      Vector.sub(b, a),
      alpha
    )
  )
)

Vector.clamp = (v, min, max) => {
  const mag = Vector.magnitude(v)
  return Vector.multScalar(
    Vector.divScalar(v, mag || 1),
    Math.max(min, Math.min(max, mag))
  )
}

Vector.angle = (v) => (
  Math.atan2(v.y, v.x)
)

Vector.fromAngle = (rad) => ({
  x: Math.cos(rad),
  y: Math.sin(rad)
})

Vector.invert = (v) => ({
  x: -v.x,
  y: -v.y
})

export default Vector
