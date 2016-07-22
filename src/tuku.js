import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Routes, browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { fork } from 'redux-saga/effects'
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

  function middleware(middleware) {
    _middlewares.push(middleware)
  }

  function model(model) {
    _models.push(model)
  }

  function router(routes) {
    _routes = routes
  }

  function start(dest) {
    addDefaultMiddlewares()
    addDefaultModels()

    Object.assign(_store, createStore(_models, _middlewares))

    sagaMiddleware.run()

    const history = createHistory(_store)

    const Routes = _routes;

    const App = (
      <Provider store={_store}>
        <Routes history={history} />
      </Provider>
    )

    return App
  }

  function dispatch(...args) {
    return _store.dispatch(...args)
  }

  function getState(...args) {
    return _store.getState(...args)
  }

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
