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
    'and match the pattern ^[a-z]+(::[a-z]+)*$'
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

  t.true(is.actionCreator(counter.save.success))
  t.true(is.actionCreator(counter.save.error))
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

  t.is(counter.getReducer(), reducer)
  t.is(reducer(undefined, { type: 'counter::increment' }), 1)
})

test('reducer enhancer', t => {
  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const double = reducer => (state, action) => reducer(state, action) * 2

  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  }, double)


  t.is(counter.getReducer(), reducer)
  t.is(reducer(undefined, { type: 'counter::increment' }), 2)
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
