import { combineReducers } from 'redux'
import set from 'lodash/set'

export default function createReducer(models) {
  const reducers = models.reduce((acc, model) => {
    const nsPath = model.getNamespace().replace('::', '.')
    set(acc, nsPath, model.getReducer())
    return acc
  }, {})

  const combine = (reducers) => {
    Object.keys(reducers).map(key => {
      if (typeof reducers[key] === 'object') {
        reducers[key] = combineReducers(reducers[key])
      }
    })
    return combineReducers(reducers)
  }

  return combine(reducers)
}
