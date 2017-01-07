import React from 'react'
import { mount } from 'enzyme'
import feeble from 'feeble'
import model from 'model'
import typeSet from 'typeSet'
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

afterEach(() => {
  typeSet.clear()
})

test('create a new app', () => {
  const app = feeble()

  expect(typeof app.middleware).toBe('function')
  expect(typeof app.model).toBe('function')
  expect(typeof app.use).toBe('function')
  expect(typeof app.start).toBe('function')
  expect(typeof app.store).toBe('object')
})

test('effect', () => {
  const app = feeble()

  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const increment = counter.action('increment')
  const double = counter.action('double')

  counter.reducer(on => {
    on(increment, state => state + 1)

    on(double, state => state * 2)
  })

  counter.effect(function* () {
    yield* takeEvery(increment.getType(), function* () {
      yield put(double())
    })
  })

  app.model(counter)

  app.start()

  app.store.dispatch(increment())

  expect(app.store.getState().counter).toBe(2)
})

test('mount', () => {
  const app = feeble()

  app.start()

  function Hello() {
    return <div>Hello</div>
  }

  const wrapper = mount(app.mount(<Hello />))

  expect(wrapper.find(Hello).length).toBe(1)
})
