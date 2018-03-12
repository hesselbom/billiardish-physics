export default (x, y, w, h) => ({
  type: 'box',
  position: { x, y },
  dimensions: {
    x: x - w / 2,
    y: y - h / 2,
    w,
    h
  }
})
