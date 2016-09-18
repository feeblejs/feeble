const types = {}

function add(name) {
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
  remove,
  has,
  values,
  clear,
}
