import tuku from 'tuku'
import merge from 'lodash/fp/merge'

const model = tuku.model({
  namespace: 'entity',
  state: {},
})

model.action('create', (name, data) => ({ name, data }))
model.action('update', (name, id, data) => ({ name, id, data }))

model.reducer(on => {
  const pattern = action => action.payload && action.payload.entities
  on(pattern, (state, payload) => merge(state, payload.entities))

  on(model.create, (state, payload) => ({
    ...state,
    [payload.name]: {
      ...state[payload.name],
      [payload.data.id]: payload.data
    }
  }))

  on(model.update, (state, payload) =>
    merge(state, {
      [payload.name]: {
        [payload.id]: payload.data,
      },
    })
  )
})

model.selector('entities',
  name => model.getState()[name],
  (name, model) => model.getState().ids,
  (entities, ids) => ids.map(id => entities[id])
)

export default model
