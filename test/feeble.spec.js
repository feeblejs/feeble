import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import feeble from 'feeble'
import model from 'model'
import typeSet from 'typeSet'
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

test.afterEach(() => {
  typeSet.clear()
})

test('create a new app', t => {
  const app = feeble()

  t.is(typeof app.middleware, 'function')
  t.is(typeof app.model, 'function')
  t.is(typeof app.router, 'function')
  t.is(typeof app.start, 'function')
  t.is(typeof app.store, 'object')
})

test('effect', t => {
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

  t.is(app.store.getState().counter, 2)
})

test('mount', t => {
  const app = feeble()

  app.start()

  function Hello() {
    return <div>Hello</div>
  }

  const wrapper = mount(app.mount(<Hello />))

  t.is(wrapper.find(Hello).length, 1)
})
