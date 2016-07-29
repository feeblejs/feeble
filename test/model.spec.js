import test from 'ava'
import model from 'model'
import typeSet from 'typeSet'
import { is } from 'utils'
import { CALL_API } from '../src/constants'

test.afterEach(() => {
  typeSet.clear()
})

test('create model', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  t.is(counter.getNamespace(), 'counter')
})

test('throw error for invalid namespace', t => {
  t.throws(
    () => { model({ namespace: 'foo1', state: 1 }) },
    'foo1 is not a valid namespace, namespace should be a string ' +
    'and match the pattern ^[a-zA-Z]+(::[a-zA-Z]+)*$'
  )
})

test('create action creator', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.action('increment', () => 'hello', () => 'tuku')

  t.deepEqual(counter.increment(), {
    type: 'counter::increment',
    payload: 'hello',
    meta: 'tuku',
  })
})

test('create api action creator', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.apiAction('save', () => ({ method: 'post', endpoint: 'save' }))

  t.deepEqual(counter.save(), {
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

  t.deepEqual(counter.save().getRequest(), {
    method: 'post',
    endpoint: 'save',
  })

  t.true(is.actionCreator(counter.save.request))
  t.true(is.actionCreator(counter.save.success))
  t.true(is.actionCreator(counter.save.error))
  t.is(counter.save.request.getType(), 'counter::save_request')
  t.is(counter.save.success.getType(), 'counter::save_success')
  t.is(counter.save.error.getType(), 'counter::save_error')
})

test('has default reducer', t => {
  const foo = model({
    namespace: 'foo',
    state: 1,
  })

  t.is(foo.getReducer()(), 1)
})

test('create reducer', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  })

  t.is(reducer(undefined, { type: 'counter::increment' }), 1)
})

test('reducer enhancer', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const double = reducer => (state, action) => reducer(state, action) * 2

  counter.reducer(on => {
    on('counter::increment', state => state + 1)
  }, double)

  const reducer = counter.getReducer()

  t.is(reducer(undefined, { type: 'counter::increment' }), 2)
  t.is(counter.getState(), 2)
})

test('define multiple reducers', t => {
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

  counter.setReducer((state, { type }) => {
    switch (type) {
      case counter.add3.getType():
        return state + 3
      default:
        return state
    }
  })

  counter.setReducer((state, { type }) => {
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

  t.is(state1, 1)
  t.is(state2, 3)
  t.is(state3, 6)
  t.is(state4, 10)
})

test('get state', t => {
  const foo = model({
    namespace: 'foo',
    state: 1,
  })

  foo.action('double')

  foo.reducer(on => {
    on(foo.double, state => state * 2)
  })

  t.is(foo.getState(), 1)

  foo.getReducer()(undefined, foo.double())

  t.is(foo.getState(), 2)
})

test('use initial state', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  counter.action('increment')

  counter.reducer(on => {
    on(counter.increment, state => state + 1)
  })

  const reducer = counter.getReducer()

  t.is(reducer(undefined, counter.increment()), 1)
  t.is(reducer(undefined, counter.increment()), 1)
})
