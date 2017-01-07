import feeble from 'feeble'
import { Observable } from 'rxjs/RX'
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

// create
model.epic($action =>
  $action.ofAction(model.create.request)
  .mergeMap(({ payload }) =>
    Observable.concat(
      Observable.of(Entity.create('todo', payload.body)),
      Observable.of(model.add(payload.body.id))
    )
  )
)

// complete
model.epic($action =>
  $action.ofAction(model.complete.request)
  .mergeMap(({ payload }) =>
    Observable.concat(
      Observable.of(Entity.update('todo', payload.body.id, payload.body)),
      Observable.of(model.remove(payload.body.id))
    )
  )
)

export default model
