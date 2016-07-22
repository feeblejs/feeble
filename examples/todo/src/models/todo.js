import tuku from 'tuku'
import { delay } from 'tuku/saga'
import { call, put } from 'tuku/saga/effects'
import omit from 'lodash/omit'
import get from 'lodash/get'
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

  model.apiAction('fetch', () => ({
    method: 'get',
    endpoint: model.getNamespace() === 'todo::completed' ? '/todos/completed' : '/todos',
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
    state => get(state, model.getStatePath()).ids,
    (todos, ids) => ids.map(id => todos[id])
  )

  model.effect(function* () {
    while (true) {
      yield put(model.fetch({ completed: model.getNamespace() === 'todo::completed' }))
      yield call(delay, 1000)
    }
  })

  return model
}
