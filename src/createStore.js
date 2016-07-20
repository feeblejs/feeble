import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux'

function createStore(models, middlewares, initialState) {
  const reducers = models.reduce((acc, model) => {
    acc[model.getNamespace()] = model.getReducer()
    return acc
  }, {})

  const reducer = combineReducers(reducers)

  const enhancer = middlewares && middlewares.length > 0 ? applyMiddleware(...middlewares) : undefined

  const store = _createStore(
    reducer,
    initialState,
    enhancer
  )

  return store
}

export default  createStore
