import { combineReducers } from 'redux'
import * as _ from 'lodash'

const combine = (reducers: any) => {
  Object.keys(reducers).forEach(key => {
    if (typeof reducers[key] === 'object') {
      reducers[key] = combineReducers(reducers[key])
    }
  })
  return combineReducers(reducers)
}

export default function createReducer(models: any[]) {
  const reducers = models.reduce((acc, model) => {
    const nsPath = model.getNamespace().replace('::', '.')
    _.set(acc, nsPath, model.getReducer())
    return acc
  }, {})

  return combine(reducers)
}
