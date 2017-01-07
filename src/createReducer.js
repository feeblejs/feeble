import { combineReducers } from 'redux'
import set from 'lodash/set'

const combine = (reducers) => {
  Object.keys(reducers).forEach(key => {
    if (typeof reducers[key] === 'object') {
      reducers[key] = combineReducers(reducers[key])
    }
  })
  return combineReducers(reducers)
}

export default function createReducer(models) {
  const reducers = models.reduce((acc, model) => {
    const nsPath = model.getNamespace().replace('::', '.')
    set(acc, nsPath, model.getReducer())
    return acc
  }, {})

  return combine(reducers)
}
