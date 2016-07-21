import tuku from 'tuku'
import { takeEvery } from 'redux-saga'
import { fork, call, put } from 'redux-saga/effects'
import request from '../helpers/request'
import uniqueId from 'lodash/uniqueId'
import omit from 'lodash/omit'

const model = tuku.model({
  namespace: 'todo',
  state: {},
})

model.action('create')
model.action('createSuccess')
model.action('createError')
model.action('fetch')
model.action('fetchSuccess')
model.action('update')
model.action('updateSuccess')
model.action('updateError')

model.reducer(on => {
  on(model.fetchSuccess, (state, payload) => payload)

  on(model.create, (state, payload) => {
    payload.id = uniqueId('todo_')

    return {
      ...state,
      [payload.id]: payload,
    }
  })

  on(model.createError, (state, payload) => omit(state, payload.id))

  on(model.update, (state, payload) => {
    payload.origin = { ...state[payload.id] }

    return {
      ...state,
      [payload.id]: payload,
    }
  })

  on(model.updateError, (state, payload) => ({
    ...state,
    [payload.id]: payload.origin
  }))
})

const fetch = function* () {
  yield* takeEvery(model.fetch.getType(), function* () {
    const response = yield call(request, '/todos', { method: 'get' })
    yield put(model.fetchSuccess(response))
  })
}

const create = function* () {
  yield* takeEvery(model.create.getType(), function* ({ payload }) {
    const response = yield call(request, '/todos', { method: 'post', body: JSON.stringify(payload)})
    if (response) {
      yield put(model.createSuccess(response))
    } else {
      yield put(model.createError(payload))
    }
  })
}

const update = function* () {
  yield* takeEvery(model.update.getType(), function* ({ payload }) {
    const response = yield call(request, `/todos/${payload.id}`, { method: 'put', body: JSON.stringify(payload)})
    if (response) {
      yield put(model.updateSuccess(response))
    } else {
      yield put(model.updateError(payload))
    }
  })
}

model.effect(function* () {
  yield [
    fork(fetch),
    fork(create),
    fork(update),
  ]
})

export default model
