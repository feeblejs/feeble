import tuku from 'tuku'
import { takeEvery } from 'tuku/saga'
import { fork, call, put } from 'tuku/saga/effects'
import request from '../helpers/request'
import omit from 'lodash/omit'
import schemas from '../schemas'

const _models = {}

export default function modelFactory(namespace) {
  if (_models[namespace]) {
    return _models[namespace]
  }

  const model = tuku.model({
    namespace,
    state: {
      ids: []
    },
  })

  _models[namespace] = model

  model.apiAction('fetch', ({ completed }) => ({
    method: 'get',
    endpoint: completed ? '/todos/completed' : '/todos',
    schema: schemas.TODO_ARRAY,
  }))

  model.apiAction('create', todo => {
    todo.id = +new Date
    todo.completed = false

    return {
      method: 'post',
      endpoint: '/todos',
      body: todo,
      schema: schemas.TODO,
    }
  })

  model.apiAction('update', todo => ({
    method: 'put',
    endpoint: `/todos/${todo.id}`,
    body: todo,
    schema: schemas.TODO,
  }))

  model.reducer(on => {
    on(model.fetch.success, (state, payload) => ({
      ids: payload.result
    }))

    on(model.create.success, (state, payload) => ({
      ids: [ ...state.ids, payload.result ]
    }))
  })

  model.selector('list',
    state => state.entity.todo,
    (state, type)  => state.todo[type].ids,
    (todos, ids) => ids.map(id => todos[id])
  )

  return model
}
