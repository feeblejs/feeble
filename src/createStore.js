import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux'
import set from 'lodash/set'

function createStore(models, middlewares, initialState) {
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

  const reducer = combine(reducers)

  const enhancer = middlewares && middlewares.length > 0 ? applyMiddleware(...middlewares) : undefined

  const store = _createStore(
    reducer,
    initialState,
    enhancer
  )

  return store
}

export default  createStore
