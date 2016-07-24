import tuku from 'tuku'
import { delay } from 'tuku/saga'
import { call, put } from 'tuku/saga/effects'
import schemas from '../../schemas'

const model = tuku.model({
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

model.reducer(on => {
  on(model.fetch.success, (state, payload) => ({
    ids: payload.result,
  }))

  on(model.create.success, (state, payload) => ({
    ids: [...state.ids, payload.result],
  }))
})

model.effect(function* () {
  while (true) {
    yield put(model.fetch())
    yield call(delay, 1000)
  }
})

export default model
