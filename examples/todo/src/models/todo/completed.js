import feeble from 'feeble'
import { delay, takeEvery } from 'feeble/effects/helper'
import { fork, call, put } from 'feeble/effects'
import Entity from '../entity'
import schemas from '../../schemas'
import without from 'lodash/without'

const model = feeble.model({
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
  body: { ...todo, completed: false },
  schema: schemas.TODO,
}))

model.action('remove')

model.reducer(on => {
  on(model.fetch.success, (state, payload) => ({
    ids: payload.result,
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

const uncomplete = function* () {
  yield* takeEvery(model.uncomplete.request, function* ({ payload }) {
    yield put(Entity.update('todo', payload.body.id, payload.body))
    yield put(model.remove(payload.body.id))
  })
}

model.effect(function* () {
  yield [
    fork(uncomplete),
  ]
})

export default model
