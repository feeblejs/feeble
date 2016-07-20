import test from 'ava'
import tuku from 'tuku'
import createStore from 'createStore'

test('create store', t => {
  const counter = tuku.model({
    namespace: 'counter',
    state: 0,
  })

  const increment = counter.action('increment')

  counter.reducer(on => {
    on(increment, state => state + 1)
  })

  const store = createStore([counter])

  store.dispatch(increment())

  t.is(store.getState().counter, 1)
})
