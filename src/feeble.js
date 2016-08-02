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

function feeble(options = {}) {
  const _models = []
  const _store = {}
  const _middlewares = []
  let _routes = null
  let _tree = null
  let _sagaMiddleware = null

  function middleware(...middlewares) {
    _middlewares.push(...middlewares)
  }

  function model(...models) {
    _models.push(...models)
  }

  function addDefaultMiddlewares() {
    if (options.callApi) {
      middleware(createApiMiddleware(options.callApi))
    }
    _sagaMiddleware = createSagaMiddleware(_models)
    middleware(_sagaMiddleware)
    middleware(routerMiddleware(browserHistory))
  }

  function addDefaultModels() {
    model(routing)
  }

  function router(routes) {
    _routes = routes
  }

  function mount(component) {
    _tree = (
      <Provider store={_store}>
        {component}
      </Provider>
    )

    return _tree
  }

  function start() {
    Object.assign(_store, createStore(_models, _middlewares))

    _sagaMiddleware.run()

    const history = createHistory(_store)

    const Routes = _routes

    _tree = mount(<Routes history={history} store={_store} />)

    return _tree
  }

  function tree() {
    return _tree
  }

  addDefaultMiddlewares()
  addDefaultModels()

  return {
    middleware,
    model,
    router,
    start,
    mount,
    store: _store,
    tree,
  }
}

feeble.model = model

export default feeble
