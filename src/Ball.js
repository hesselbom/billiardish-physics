let ballCounter = 0

export default (x, y, radius, mass = 1, drag = 1) => ({
  id: ++ballCounter,
  type: 'ball',
  position: { x, y },
  velocity: { x: 0, y: 0 },
  drag,
  mass,
  invMass: 1 / mass,
  radius,
  radiusSquared: radius * radius
})
