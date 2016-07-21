import tuku from 'tuku'

const model = tuku.model({
  namespace: 'todo',
  state: [],
})

model.action('add')

model.reducer(on => {
  on(model.add, (state, payload) => [...state, payload])
})

model.effect(function* () {})

export default model
