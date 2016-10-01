import * as React from 'react'
import { ReactNode } from "react"
import { Provider } from 'react-redux'
import { Store } from "redux"
import model from './model'
import createApiMiddleware from './middlewares/api'
import createSagaMiddleware from './middlewares/saga'
import createStore from './createStore'

interface Options {
  callApi?: () => Promise<void> // Todo: what does void mean?
}

interface Feeble {
  (): any,
  model: any,
}

const feeble = <Feeble>function feeble(options: Options = {}) {
  const _stated = false
  const _app = {}
  const _models: any[] = []
  const _store: Store<any> = {} as Store<any>
  const _middlewares: any[] = []
  let _tree: any = null
  let _sagaMiddleware: any = null

  function middleware(...middlewares: any[]) {
    _middlewares.push(...middlewares)
  }

  function model(...models: any[]) {
    _models.push(...models)
  }

  function addDefaultMiddlewares(): void {
    if (options.callApi) {
      middleware(createApiMiddleware(options.callApi))
    }
    _sagaMiddleware = createSagaMiddleware(_models)
    middleware(_sagaMiddleware)
  }

  function addDefaultModels(): any {
    // not default model currently
  }

  function start() {
    (<any>Object).assign(_store, createStore(_models, _middlewares))

    _sagaMiddleware.run()
  }

  function mount(component: ReactNode) {
    if (!_stated) {
      start()
    }
    _tree = React.createElement(Provider, { store: _store, children: component })

    return _tree
  }

  function tree() {
    return _tree
  }

  function use(ext: (app: any) => any) {
    return ext(_app)
  }

  addDefaultMiddlewares()
  addDefaultModels()

  ;(<any>Object).assign(_app, {
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
