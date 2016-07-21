import tuku from 'tuku'
import { takeEvery } from 'tuku/saga'
import { fork, call, put } from 'tuku/saga/effects'
import request from '../helpers/request'
import uniqueId from 'lodash/uniqueId'
import omit from 'lodash/omit'

const _models = {}

export default function modelFactory(namespace) {
  if (_models[namespace]) {
    return _models[namespace]
  }

  const model = tuku.model({
    namespace,
    state: {},
  })

  _models[namespace] = model

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
      payload.id = uniqueId(`todo_${(+new Date)}_`)
      payload.completed = false

      return {
        ...state,
        [payload.id]: payload,
      }
    })

    on(model.createError, (state, payload) => omit(state, payload.id))

    on(model.update, (state, payload) => omit(state, payload.id))

    on(model.updateError, (state, payload) => {
      payload.completed = false

      return {
        ...state,
        [payload.id]: payload
      }
    })
  })

  const fetch = function* () {
    yield* takeEvery(model.fetch, function* ({ payload }) {
      const endpoint = payload.completed ? '/todos/completed' : '/todos'
      const response = yield call(request, endpoint, { method: 'get' })
      yield put(model.fetchSuccess(response))
    })
  }

  const create = function* () {
    yield* takeEvery(model.create, function* ({ payload }) {
      const response = yield call(request, '/todos', { method: 'post', body: JSON.stringify(payload)})
      if (response) {
        yield put(model.createSuccess(response))
      } else {
        yield put(model.createError(payload))
      }
    })
  }

  const update = function* () {
    yield* takeEvery(model.update, function* ({ payload }) {
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

  return model
}

