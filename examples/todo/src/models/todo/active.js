import feeble from 'feeble'
import { delay, takeEvery } from 'feeble/effects/helper'
import { fork, call, put } from 'feeble/effects'
import Entity from '../entity'
import schemas from '../../schemas'
import without from 'lodash/without'

const model = feeble.model({
  namespace: 'todo::active',
  state: {
    ids: [],
  },
})

model.apiAction('fetch', () => ({
  method: 'get',
  endpoint: '/todos',
  schema: schemas.TODO_ARRAY,
}))

model.apiAction('create', data => {
  const todo = {
    id: +new Date,
    completed: false,
    ...data,
  }

  return {
    method: 'post',
    endpoint: '/todos',
    body: todo,
    schema: schemas.TODO,
  }
})

model.apiAction('complete', todo => ({
  method: 'put',
  endpoint: `/todos/${todo.id}`,
  body: { ...todo, completed: true },
  schema: schemas.TODO,
}))

model.action('add')
model.action('remove')

model.reducer(on => {
  on(model.fetch.success, (state, payload) => ({
    ids: payload.result,
  }))

  on(model.add, (state, payload) => ({
    ids: [...state.ids, payload],
  }))

  on(model.remove, (state, payload) => ({
    ids: without(state.ids, payload),
  }))
})

model.selector('list',
  () => Entity.getState().todo,
  () => model.getState().ids,
  (entities, ids) => ids.map(id => entities[id])
)

const create = function* () {
  yield* takeEvery(model.create.request, function* ({ payload }) {
    yield put(Entity.create('todo', payload.body))
    yield put(model.add(payload.body.id))
  })
}

const complete = function* () {
  yield* takeEvery(model.complete.request, function* ({ payload }) {
    yield put(Entity.update('todo', payload.body.id, payload.body))
    yield put(model.remove(payload.body.id))
  })
}

model.effect(function* () {
  yield [
    fork(create),
    fork(complete),
  ]
})

export default model
