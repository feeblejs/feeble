const types: { [key: string]: boolean } = {}

function add(name: string) {
  types[name] = true
}

function remove(name: string) {
  delete types[name]
}

function has(name: string) {
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
