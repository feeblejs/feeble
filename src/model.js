import typeSet from './typeSet'
import { CALL_API, NAMESPACE_PATTERN } from './constants'
import { createSelector } from 'reselect'
import invariant from 'invariant'
import { is } from './utils'

const identity = (arg) => arg

const invariantReducer = (value, name) => {
  invariant(
    is.undef(value) || is.func(value),
    '%s should be a function',
    name
  )
}

function model(options) {
  invariant(
    is.namespace(options.namespace),
    '%s is not a valid namespace, namespace should be a string ' +
    'and match the pattern %s',
    options.namespace,
    NAMESPACE_PATTERN
  )

  const _namespace = options.namespace
  const _state = options.state

  let _model = {}
  let _selectors = {}
  let _reducer = (state = _state) => state
  let _effect = null

  function action(type, payloadReducer, metaReducer) {
    invariantReducer(payloadReducer, 'payload reducer')
    invariantReducer(metaReducer, 'meta reducer')

    if (typeof payloadReducer === 'undefined') {
      payloadReducer = identity
    }

    const fullType = [_namespace, type].join('::')

    invariant(
      !typeSet.has(fullType),
      '%s has already token by another action',
      fullType
    )

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

  function apiAction(type, requestReducer, metaReducer) {
    invariantReducer(requestReducer, 'request reducer')
    invariantReducer(metaReducer, 'meta reducer')

    const suffixes = ['request', 'success', 'error']

    const types = suffixes.map(suffix => {
      return [options.namespace, `${type}_${suffix}`].join('::')
    })

    function apiActionCreator(...args) {
      const api = requestReducer(...args)
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

      invariant(
        !typeSet.has(type),
        '%s has already used for another action',
        type
      )

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
      } else if (is.actionCreator(pattern)) {
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
