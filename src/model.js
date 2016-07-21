import typeSet from './typeSet'

const identity = (arg) => arg

function isActionCreator(pattern) {
  return typeof pattern.getType === 'function'
}

function model(options) {
  const _namespace = options.namespace
  const _state = options.state

  let _model
  let _reducer
  let _effect

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

  function reducer(handlers = {}) {
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

    return _reducer
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

  _model = {
    action,
    reducer,
    effect,
    getNamespace,
    setReducer,
    getReducer,
    getEffect,
  }

  return _model
}

export default model
