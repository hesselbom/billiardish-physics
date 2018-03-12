let Pair = {}
let pairs = {}
let pairsList = []

Pair.id = (a, b) => (
  a.id < b.id
  ? 'A' + a.id + 'B' + b.id
  : 'A' + b.id + 'B' + a.id
)

Pair.get = (a, b) => {
  const id = Pair.id(a, b)
  const pair = pairs[id]

  if (!pair) {
    pairs[id] = { id, a, b }
    pairsList.push(pairs[id])
  }

  return pairs[id]
}

Pair.isActive = (a, b) => (
  Pair.get(a, b).active
)

Pair.setActive = (a, b, active) => {
  const id = Pair.id(a, b)
  const pair = pairs[id] || {}

  pair.active = active

  pairs[id] = pair
}

Pair.getInactivated = (activeIds) => {
  let inactivated = []

  for (let i = 0; i < pairsList.length; i++) {
    const pair = pairsList[i]

    if (pair.active && activeIds.indexOf(pair.id) === -1) {
      Pair.setActive(pair.a, pair.b, false)
      inactivated.push(pair)
    }
  }

  return inactivated
}

export default Pair
