import tuku from 'tuku'
import { delay } from 'tuku/saga'
import { call, put } from 'tuku/saga/effects'
import schemas from '../../schemas'

const model = tuku.model({
  namespace: 'todo::completed',
  state: {
    ids: [],
  },
})

model.apiAction('fetch', () => ({
  method: 'get',
  endpoint: '/todos/completed',
  schema: schemas.TODO_ARRAY,
}))

model.apiAction('uncomplete', todo => ({
  method: 'put',
  endpoint: `/todos/${todo.id}`,
  body: { ...todo, completed: true },
  schema: schemas.TODO,
}))

model.reducer(on => {
  on(model.fetch.success, (state, payload) => ({
    ids: payload.result,
  }))
})

model.effect(function* () {
  while (true) {
    yield put(model.fetch())
    yield call(delay, 1000)
  }
})

export default model
