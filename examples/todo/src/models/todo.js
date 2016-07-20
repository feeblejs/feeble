import tuku from 'tuku'

const model = tuku.model({
  namespace: 'todo',
  state: [],
})

export const add = model.action('add')

model.reducer(on => {
  on(add, (state, payload) => [...state, payload])
})

model.effect(function* () {})

export default model
