import typeSet from './typeSet'
import CALL_API from './CALL_API'
import { createSelector } from 'reselect'

const identity = (arg) => arg

function isActionCreator(pattern) {
  return typeof pattern.getType === 'function'
}

function model(options) {
  const _namespace = options.namespace
  const _state = options.state

  let _model = {}
  let _selectors = {}
  let _reducer = null
  let _effect = null

  function action(type, payloadReducer, metaReducer) {
    if (typeof payloadReducer !== 'function') {
      payloadReducer = identity
    }

    if (typeof metaReducer !== 'function') {
      metaReducer = undefined
    }

    const fullType = [_namespace, type].join('::')

    typeSet.add(fullType)

    function actionCreator(...args) {
      const action = { type: fullType }

      action.payload = payloadReducer(...args)

      if (metaReducer) {
        action.meta = metaReducer(...args)
      }

      return action
    }

    actionCreator.getType = () => fullType
    actionCreator.toString = () => fullType

    _model[type] = actionCreator

    return actionCreator
  }

  function apiAction(type, apiReducer, metaReducer) {
    const suffixes = ['request', 'success', 'error']

    const types = suffixes.map(suffix => {
      return [options.namespace, `${type}_${suffix}`].join('::')
    })

    function apiActionCreator(...args) {
      const api = apiReducer(...args)
      const action = {
        [CALL_API]: {
          types,
          ...api
        }
      }
      if (metaReducer) {
        action.meta = metaReducer(...args)
      }
      return action
    }

    suffixes.forEach((suffix, index) => {
      const type = types[index]
      typeSet.add(type)
      apiActionCreator[suffix] = {
        getType: () => type,
        toString: () => type,
      }
    })

    _model[type] = apiActionCreator

    return apiActionCreator
  }

  function reducer(handlers = {}, enhancer = identity) {
    const patternHandlers = []

    let type

    function on(pattern, handler) {
      if (typeof pattern === 'string') {
        handlers[pattern] = handler
      } else if (isActionCreator(pattern)) {
        handlers[pattern.getType()] = handler
      } else if (Array.isArray(pattern)) {
        pattern.forEach(p => on(p, handler))
      } else if (typeof pattern === 'function') {
        patternHandlers.push({
          pattern,
          handler,
        })
      }
    }

    if (typeof handlers === 'function') {
      const factory = handlers
      handlers = {}
      factory(on)
    }

    _reducer = (state = _state, action) => {
      if (action && handlers[action.type]) {
        return handlers[action.type](state, action.payload, action.meta)
      } else {
        for (let { pattern, handler } of patternHandlers) {
          if (pattern(action)) {
            return handler(state, action.payload, action.meta)
          }
        }
        return state
      }
    }

    _reducer = enhancer(_reducer)

    return _reducer
  }

  function selector(name, ...funcs) {
    _selectors[name] = createSelector(...funcs)
  }

  function select(name) {
    return _selectors[name]
  }

  function effect(effect) {
    _effect = effect
  }

  function getNamespace() {
    return _namespace
  }

  function setReducer(reducer) {
    return _reducer = reducer
  }

  function getReducer() {
    return _reducer
  }

  function getEffect() {
    return _effect
  }

  function getStatePath() {
    return _namespace.replace('::', '.')
  }

  _model = {
    action,
    apiAction,
    reducer,
    selector,
    select,
    effect,
    getNamespace,
    setReducer,
    getReducer,
    getEffect,
    getStatePath,
  }

  return _model
}

export default model
