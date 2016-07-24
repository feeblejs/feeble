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

  let   _state      = options.state
  let   _model      = {}
  let   _reducer    = (state = _state) => state
  const _namespace  = options.namespace
  const _selectors  = {}
  const _effects    = []

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

    const types = suffixes.map(suffix => [_namespace, `${type}_${suffix}`].join('::'))

    function apiActionCreator(...args) {
      const request = requestReducer(...args)
      const action = {
        [CALL_API]: {
          types,
          ...request,
        },
      }
      if (metaReducer) {
        action.meta = metaReducer(...args)
      }
      Object.defineProperty(action, 'getRequest', { value: () => request })
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

      apiActionCreator[suffix] = (payload, meta) => ({ type, payload, meta })
      apiActionCreator[suffix].toString = () => type
      apiActionCreator[suffix].getType = () => type
    })

    _model[type] = apiActionCreator

    return apiActionCreator
  }

  function reducer(handlers = {}, enhancer = identity) {
    const patternHandlers = []

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
      let nextState = state
      if (action && handlers[action.type]) {
        nextState = handlers[action.type](state, action.payload, action.meta)
        _state = nextState
        return nextState
      }
      for (const { pattern, handler } of patternHandlers) {
        if (pattern(action)) {
          nextState = handler(state, action.payload, action.meta)
          _state = nextState
          return nextState
        }
      }
      _state = nextState
      return nextState
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
    _effects.push(effect)
    return _effects
  }

  function getNamespace() {
    return _namespace
  }

  function setReducer(reducer) {
    _reducer = reducer
    return _reducer
  }

  function getReducer() {
    return _reducer
  }

  function getEffects() {
    return _effects
  }

  function getState() {
    return _state
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
    getEffects,
    getState,
  }

  return _model
}

export default model
