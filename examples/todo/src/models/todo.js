import tuku from 'tuku'
import { takeEvery } from 'redux-saga'
import { fork, call, put } from 'redux-saga/effects'
import request from '../helpers/request'

const model = tuku.model({
  namespace: 'todo',
  state: {},
})

model.action('create')
model.action('createSuccess')
model.action('fetch')
model.action('fetchSuccess')
model.action('update')
model.action('updateSuccess')

model.reducer(on => {
  on(model.fetchSuccess, (state, payload) => payload)

  on(model.createSuccess, (state, payload) => ({
    ...state,
    [payload.id]: payload,
  }))

  on(model.updateSuccess, (state, payload) => ({
    ...state,
    [payload.id]: payload,
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
    yield put(model.createSuccess(response))
  })
}

const update = function* () {
  yield* takeEvery(model.update.getType(), function* ({ payload }) {
    const response = yield call(request, `/todos/${payload.id}`, { method: 'put', body: JSON.stringify(payload)})
    yield put(model.updateSuccess(response))
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
