export default (radius) => ({
  type: 'boundary-circle',
  radius,
  radiusSquared: radius * radius
})
