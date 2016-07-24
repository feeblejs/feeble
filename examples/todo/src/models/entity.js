import tuku from 'tuku'
import merge from 'lodash/fp/merge'

const model = tuku.model({
  namespace: 'entity',
  state: {},
})

model.reducer(on => {
  const pattern = action => action.payload && action.payload.entities
  on(pattern, (state, payload) => merge(state, payload.entities))
})

model.selector('entities',
  name => model.getState()[name],
  (name, model) => model.getState().ids,
  (entities, ids) => ids.map(id => entities[id])
)

export default model
