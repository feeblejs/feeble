const types = {}

function add(name) {
  if (has(name)) {
    throw new Error(`Duplicate action type: ${name}`)
  }
  types[name] = true
}

function remove(name) {
  delete types[name]
}

function has(name) {
  return !!types[name]
}

function values() {
  return Object.keys(types)
}

function clear() {
  values().forEach(remove)
}

export default {
  add,
  'delete': remove,
  has,
  values,
  clear,
}
