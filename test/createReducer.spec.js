import test from 'ava'
import tuku from 'tuku'
import createReducer from 'createReducer'

test('default', t => {
  const foo = tuku.model({
    namespace: 'foo',
    state: 1,
  })

  const bar1 = tuku.model({
    namespace: 'bar::one',
    state: 2,
  })

  const bar2 = tuku.model({
    namespace: 'bar::two',
    state: 3,
  })

  const reducer = createReducer([foo, bar1, bar2])

  t.deepEqual(reducer(undefined, { type: 'init' }), {
    foo: 1,
    bar: {
      one: 2,
      two: 3,
    },
  })
})
