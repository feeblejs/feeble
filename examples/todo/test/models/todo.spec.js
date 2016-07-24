import test from 'ava'
import factory from 'models/todo'
import schemas from 'schemas'

const model = factory('todo::active')
const reducer = model.getReducer()

test('basic', t => {
  t.is(model.getNamespace(), 'todo::active')
  t.deepEqual(model.getState(), { ids: [] })
})
