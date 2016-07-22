import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux'
import createReducer from './createReducer'

function createStore(models, middlewares, initialState) {
  const reducer = createReducer(models)

  const enhancer = middlewares && middlewares.length > 0 ? applyMiddleware(...middlewares) : undefined

  const store = _createStore(
    reducer,
    initialState,
    enhancer
  )

  return store
}

export default  createStore
