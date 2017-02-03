import feeble from 'feeble'
import { Observable } from 'rxjs/Rx'
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

// uncomplete
model.epic(action$ =>
  action$.ofAction(model.uncomplete.request)
  .mergeMap(({ payload }) =>
    Observable.concat(
      Observable.of(Entity.update('todo', payload.body.id, payload.body)),
      Observable.of(model.remove(payload.body.id))
    )
  )
)

export default model
