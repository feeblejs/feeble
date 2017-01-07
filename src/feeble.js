import React from 'react'
import { Provider } from 'react-redux'
import model from './model'
import createApiMiddleware from './middlewares/api'
import createEpicMiddleware from './middlewares/epic'
import createStore from './createStore'

function feeble(options = {}) {
  let _started = false
  const _app = {}
  const _models = []
  const _store = {}
  const _middlewares = []
  let _tree = null

  function middleware(...middlewares) {
    _middlewares.push(...middlewares)
  }

  function model(...models) {
    _models.push(...models)
  }

  function addDefaultMiddlewares() {
    const epicMiddleware = createEpicMiddleware(_models)
    _middlewares.unshift(epicMiddleware)
    if (options.callApi) {
      _middlewares.unshift(createApiMiddleware(options.callApi))
    }
  }

  function addDefaultModels() {
    // not default model currently
  }

  function start() {
    addDefaultMiddlewares()
    addDefaultModels()
    Object.assign(_store, createStore(_models, _middlewares))
    _started = true
  }

  function mount(component) {
    if (!_started) {
      start()
    }
    _tree = (
      <Provider store={_store}>
        {component}
      </Provider>
    )

    return _tree
  }

  function tree() {
    return _tree
  }

  function use(ext) {
    return ext(_app)
  }

  Object.assign(_app, {
    middleware,
    model,
    mount,
    store: _store,
    tree,
    use,
    start,
  })

  return _app
}

feeble.model = model

export default feeble
