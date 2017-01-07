import model from 'model'
import typeSet from 'typeSet'
import isActionCreator from 'utils/isActionCreator'
import { CALL_API } from '../src/constants'

afterEach(() => {
  typeSet.clear()
})

test('create model', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  expect(counter.getNamespace()).toBe('counter')
})

test('throw error for invalid namespace', () => {
  expect(() => {
    model({ namespace: 'foo1', state: 1 })
  }).toThrowError(
    'foo1 is not a valid namespace, namespace should be a string ' +
    'and match the pattern ^[a-zA-Z]+(::[a-zA-Z]+)*$'
  )
})

test('create action creator', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.action('increment', () => 'hello', () => 'feeble')

  expect(counter.increment()).toEqual({
    type: 'counter::increment',
    payload: 'hello',
    meta: 'feeble',
  })
})

test('create api action creator', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.apiAction('save', () => ({ method: 'post', endpoint: 'save' }))

  expect(counter.save()).toEqual({
    [CALL_API]: {
      types: [
        'counter::save_request',
        'counter::save_success',
        'counter::save_error',
      ],
      method: 'post',
      endpoint: 'save',
    },
  })

  expect(counter.save().getRequest()).toEqual({
    method: 'post',
    endpoint: 'save',
  })

  expect(isActionCreator(counter.save.request)).toBe(true)
  expect(isActionCreator(counter.save.success)).toBe(true)
  expect(isActionCreator(counter.save.error)).toBe(true)
  expect(counter.save.request.getType()).toBe('counter::save_request')
  expect(counter.save.success.getType()).toBe('counter::save_success')
  expect(counter.save.error.getType()).toBe('counter::save_error')
})

test('has default reducer', () => {
  const foo = model({
    namespace: 'foo',
    state: 1,
  })

  expect(foo.getReducer()()).toBe(1)
})

test('create reducer', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  })

  expect(reducer(undefined, { type: 'counter::increment' })).toBe(1)
})

test('reducer enhancer', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const double = reducer => (state, action) => reducer(state, action) * 2

  counter.reducer(on => {
    on('counter::increment', state => state + 1)
  }, double)

  const reducer = counter.getReducer()

  expect(reducer(undefined, { type: 'counter::increment' })).toBe(2)
  expect(counter.getState()).toBe(2)
})

test('define multiple reducers', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.action('add1')
  counter.action('add2')
  counter.action('add3')
  counter.action('add4')

  counter.reducer(on => {
    on(counter.add1, state => state + 1)
  })

  counter.reducer(on => {
    on(counter.add2, state => state + 2)
  })

  counter.addReducer((state, { type }) => {
    switch (type) {
      case counter.add3.getType():
        return state + 3
      default:
        return state
    }
  })

  counter.addReducer((state, { type }) => {
    switch (type) {
      case counter.add4.getType():
        return state + 4
      default:
        return state
    }
  })

  const reducer = counter.getReducer()
  const state1 = reducer(undefined, counter.add1())
  const state2 = reducer(state1, counter.add2())
  const state3 = reducer(state2, counter.add3())
  const state4 = reducer(state3, counter.add4())

  expect(state1).toBe(1)
  expect(state2).toBe(3)
  expect(state3).toBe(6)
  expect(state4).toBe(10)
})

test('get state', () => {
  const foo = model({
    namespace: 'foo',
    state: 1,
  })

  foo.action('double')

  foo.reducer(on => {
    on(foo.double, state => state * 2)
  })

  expect(foo.getState()).toBe(1)

  foo.getReducer()(undefined, foo.double())

  expect(foo.getState()).toBe(2)
})

test('use initial state', () => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.action('increment')

  counter.reducer(on => {
    on(counter.increment, state => state + 1)
  })

  const reducer = counter.getReducer()

  expect(reducer(undefined, counter.increment())).toBe(1)
  expect(reducer(undefined, counter.increment())).toBe(1)
})

test('create selector', () => {
  const rectangle = model({
    namespace: 'rectangle',
  })

  const resultFunc = jest.fn((width, height) => width * height)

  rectangle.selector('area',
    rect => rect.width,
    rect => rect.height,
    resultFunc
  )

  expect(rectangle.select('area', { width: 10, height: 5 })).toBe(50)
  expect(resultFunc.mock.calls.length).toBe(1)
  expect(rectangle.select('area', { width: 10, height: 5 })).toBe(50)
  expect(resultFunc.mock.calls.length).toBe(1)
  expect(rectangle.select('area', { width: 10, height: 5 })).toBe(50)
  expect(rectangle.select('area', { width: 10, height: 6 })).toBe(60)
  expect(resultFunc.mock.calls.length).toBe(2)
})

test('structured selctor', () => {
  const rectangle = model({
    namespace: 'rectangle',
  })

  rectangle.selector('geometry', {
    area: rect => rect.width * rect.height,
    perimeter: rect => (rect.width + rect.height) * 2,
  }, { structured: true })

  const rect = { width: 10, height: 5 }

  expect(rectangle.select('geometry', rect)).toEqual({ area: 50, perimeter: 30 })
  expect(rectangle.select('geometry', rect)).toBe(rectangle.select('geometry', rect))
})
