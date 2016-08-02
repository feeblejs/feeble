import test from 'ava'
import feeble from 'feeble'
import createReducer from 'createReducer'

test('default', t => {
  const foo = feeble.model({
    namespace: 'foo',
    state: 1,
  })

  const bar1 = feeble.model({
    namespace: 'bar::one',
    state: 2,
  })

  const bar2 = feeble.model({
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
