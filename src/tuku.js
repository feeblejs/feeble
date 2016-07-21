import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Routes, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { fork } from 'redux-saga/effects'
import model from './model'
import createSagaMiddleware from './createSagaMiddleware'
import createStore from './createStore'
import routing from './models/routing'

function tuku() {
  const _models = []
  const _middlewares = []
  let _routes = null
  let _store = null

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
    model(routing)

    const sagaMiddleware = createSagaMiddleware(_models)

    middleware(sagaMiddleware)
    middleware(routerMiddleware(browserHistory))

    _store = createStore(_models, _middlewares)

    sagaMiddleware.run()

    const history = syncHistoryWithStore(browserHistory, _store)

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
    dispatch,
    getState,
  }
}

tuku.model = model

export default tuku
