import tuku from 'tuku'
import merge from 'lodash/fp/merge'

const model = tuku.model({
  namespace: 'entity',
  state: {}
})

model.reducer(on => {
  const pattern = action => action.payload && action.payload.entities
  on(pattern, (state, payload) => {
    return merge(state, payload.entities)
  })
})

export default model
