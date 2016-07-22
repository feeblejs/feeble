import tuku from 'tuku'
import { takeEvery } from 'tuku/saga'
import { fork, call, put } from 'tuku/saga/effects'
import request from '../helpers/request'
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

  model.apiAction('fetch', ({ completed }) => ({
    method: 'get',
    endpoint: completed ? '/todos/completed' : '/todos',
  }))

  model.apiAction('create', todo => {
    todo.id = +new Date
    todo.completed = false

    return {
      method: 'post',
      endpoint: '/todos',
      body: todo,
    }
  })

  model.apiAction('update', todo => ({
    method: 'put',
    endpoint: `/todos/${todo.id}`,
    body: todo
  }))

  model.reducer(on => {
    on(model.fetch.success, (state, payload) => payload)

    on(model.create.request, (state, payload) => ({
      ...state,
      [payload.body.id]: payload.body,
    }))

    on(model.create.error, (state, payload) => omit(state, payload.id))

    on(model.update.request, (state, payload) => omit(state, payload.body.id))

    on(model.update.error, (state, payload) => ({
      ...state,
      [payload.id]: {
        ...payload,
        completed: false
      }
    }))
  })

  return model
}
