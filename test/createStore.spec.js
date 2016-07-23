import test from 'ava'
import model from 'model'
import typeSet from 'typeSet'
import createStore from 'createStore'

test.afterEach(() => {
  typeSet.clear()
})

test('create store', t => {
  const counter = model({
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

test('nested namespace', t => {
  const counterFactory = ({ namespace, state }) => {
    const counter = model({
      namespace,
      state,
    })

    counter.action('increment')

    counter.reducer(on => {
      on(counter.increment, state => state + 1) // eslint-disable-line
    })

    return counter
  }

  const counterOne = counterFactory({
    namespace: 'counter::one',
    state: 1,
  })

  const counterTwo = counterFactory({
    namespace: 'counter::two',
    state: 2,
  })

  const store = createStore([counterOne, counterTwo])

  t.deepEqual(store.getState().counter, {
    one: 1,
    two: 2,
  })

  store.dispatch(counterOne.increment())

  t.deepEqual(store.getState().counter, {
    one: 2,
    two: 2,
  })

  store.dispatch(counterTwo.increment())

  t.deepEqual(store.getState().counter, {
    one: 2,
    two: 3,
  })
})
