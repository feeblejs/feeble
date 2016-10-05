import { SagaIterator } from "redux-saga";
import { Reducer } from "redux";
import typeSet from './typeSet'
import { CALL_API, NAMESPACE_PATTERN } from './constants'
import { createSelector, createStructuredSelector } from 'reselect'
import invariant from 'invariant'
import composeReducers from './composeReducers'
import isNamespace from './utils/isNamespace'
import isActionCreator from './utils/isActionCreator'
import * as _ from 'lodash'

interface ModelOptions {
  namespace: string,
  state: any,
}

interface ActionReducer {
  (...args: any[]): any
}

interface PayloadReducer extends ActionReducer {}
interface MetaReducer extends ActionReducer {}
interface RequestReducer extends ActionReducer {}

interface ActionCreatorFactory {
  (type: string, func1?: PayloadReducer, func2?: MetaReducer): ActionCreator
}

interface APIActionCreatorFactory {
  (type: string, func1: RequestReducer, func2? :MetaReducer): APIActionCreator
}

export interface Action {
  type: string,
  payload?: any,
  meta?: any,
}

interface ActionCreator {
  (): any,
  getType?: () => string,
  toString?: () => string,
}

interface APIActionCreator {
  [key: string]: any
}

type ReducerFactory = (handler: ReducerMapping | ReducerBinding) => any

interface ReducerMapping {
  [type: string]: Handler<any>
}

type ReducerBinding = (on: any) => void

type SelectorFactory = (name: string, ...args: any[]) => void

type Select = (name: string) => any

interface PatternFn {
  (action: Action): boolean
}

type Handler<T> = (state: T, payload: any, meta: any) => T

type Pattern = string | PatternFn | ActionCreator

interface PatternHandler {
  pattern: Pattern,
  handler: Handler<any>
}

type Effect = () => SagaIterator

const identity = <T>(arg: T): T => arg

const invariantReducer = (value: any, name: string) => {
  invariant(
    _.isUndefined(value) || _.isFunction(value),
    '%s should be a function',
    name
  )
}

function model(options: ModelOptions) {
  invariant(
    isNamespace(options.namespace),
    '%s is not a valid namespace, namespace should be a string ' +
    'and match the pattern %s',
    options.namespace,
    NAMESPACE_PATTERN
  )

  const _initialState = options.state
  let _state = _initialState
  let _model: any = {}
  let _effect: Effect
  const _namespace = options.namespace
  const _selectors: { [key: string]: any } = {}
  const _reducers: Reducer<any>[] = [
    (state = _state) => state,
  ]

  function action(type: string, payloadReducer?: PayloadReducer, metaReducer?: MetaReducer): ActionCreator {
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

    const actionCreator: ActionCreator = <ActionCreator>(...args: any[]) => {
      const action: Action = <Action>{ type: fullType }

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

  function apiAction(type: string, requestReducer?: RequestReducer, metaReducer?: MetaReducer): APIActionCreator {
    invariantReducer(requestReducer, 'request reducer')
    invariantReducer(metaReducer, 'meta reducer')

    const suffixes = ['request', 'success', 'error']

    const types = suffixes.map(suffix => [_namespace, `${type}_${suffix}`].join('::'))

    const apiActionCreator: APIActionCreator = (...args: any[]) => {
      const request = requestReducer(...args)
      const action: Action = <Action>{
        [CALL_API]: (<any>Object).assign({}, { types }, request),
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
        '%s has already token by another action',
        type
      )

      typeSet.add(type)

      apiActionCreator[suffix] = (payload: any, meta: any): Action => ({ type, payload, meta })
      apiActionCreator[suffix].toString = () => type
      apiActionCreator[suffix].getType = () => type
    })

    _model[type] = apiActionCreator

    return apiActionCreator
  }

  function reducer(handlers: { [key: string]: any } = {}, enhancer = identity): Reducer<any> {
    const patternHandlers: PatternHandler[] = []

    function on(pattern: Pattern, handler: Handler<any>) {
      if (typeof pattern === 'string') {
        handlers[pattern] = handler
      } else if (isActionCreator(pattern)) {
        handlers[(<ActionCreator>pattern).getType()] = handler
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

    let reduce = (state = _initialState, action: Action) => {
      if (action && handlers[action.type]) {
        return handlers[action.type](state, action.payload, action.meta)
      }
      for (const { pattern, handler } of patternHandlers) {
        if ((<PatternFn>pattern)(action)) {
          return handler(state, action.payload, action.meta)
        }
      }
      return state
    }

    reduce = enhancer(reduce)

    _reducers.push(reduce)

    return reduce
  }

  function selector(name: string, ...args: any[]): void {
    const isOptions = (v: any): boolean => !_.isUndefined(v.structured)
    const last = args.pop()
    if (isOptions(last) && last.structured) {
      _selectors[name] = createStructuredSelector.apply(null, args)
    } else {
      _selectors[name] = createSelector.apply(null, [...args, last])
    }
  }

  function select(name: string, ...args: any[]): Select {
    return _selectors[name](...args)
  }

  function effect(effect: Effect): Effect {
    _effect = effect
    return _effect
  }

  function getNamespace(): string {
    return _namespace
  }

  function addReducer(reducer: () => any): Reducer<any> {
    _reducers.push(reducer)
    return reducer
  }

  function getReducer(): Reducer<any> {
    const reducer = composeReducers(_reducers)
    return (state: any, action: Action) => {
      const nextState = reducer(state, action)
      _state = nextState
      return nextState
    }
  }

  function getEffect(): Effect {
    return _effect
  }

  function getState(): any {
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
    addReducer,
    getReducer,
    getEffect,
    getState,
  }

  return _model
}

export default model
