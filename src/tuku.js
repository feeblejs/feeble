import React from 'react'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import model from './model'
import createApiMiddleware from './middlewares/api'
import createSagaMiddleware from './middlewares/saga'
import createStore from './createStore'
import createHistory from './createHistory'
import routing from './models/routing'

function tuku(options = {}) {
  const _models = []
  const _store = {}
  const _middlewares = []
  let _routes = null
  let sagaMiddleware = null

  function middleware(...middlewares) {
    _middlewares.push(...middlewares)
  }

  function model(...models) {
    _models.push(...models)
  }

  function addDefaultMiddlewares() {
    if (options.request) {
      middleware(createApiMiddleware(options.request))
    }
    sagaMiddleware = createSagaMiddleware(_models)
    middleware(sagaMiddleware)
    middleware(routerMiddleware(browserHistory))
  }

  function addDefaultModels() {
    model(routing)
  }

  function router(routes) {
    _routes = routes
  }

  function start() {
    Object.assign(_store, createStore(_models, _middlewares))

    sagaMiddleware.run()

    const history = createHistory(_store)

    const Routes = _routes

    return (
      <Provider store={_store}>
        <Routes history={history} store={_store} />
      </Provider>
    )
  }

  addDefaultMiddlewares()
  addDefaultModels()

  return {
    middleware,
    model,
    router,
    start,
    store: _store,
  }
}

tuku.model = model

export default tuku
