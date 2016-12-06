import { createStore as _createStore, applyMiddleware } from 'redux'
import createReducer from './createReducer'

function createStore(models: any[], middlewares: any[], initialState?: any): any {
  const reducer = createReducer(models)

  const enhancer = middlewares && middlewares.length > 0 ?
    applyMiddleware(...middlewares) : undefined

  const store = _createStore(
    reducer,
    initialState,
    enhancer
  )

  return store
}

export default createStore
