import test from 'ava'
import model from 'models/todo/active'
import schemas from 'schemas'

const reducer = model.getReducer()

test('basic', t => {
  t.is(model.getNamespace(), 'todo::active')
  t.deepEqual(model.getState(), { ids: [] })
})

test('action fetch', t => {
  t.deepEqual(model.fetch().getRequest(), {
    method: 'get',
    endpoint: '/todos',
    schema: schemas.TODO_ARRAY,
  })
})

test('action create', t => {
  const data = {
    id: 1,
    name: 'foo',
  }
  t.deepEqual(model.create(data).getRequest(), {
    method: 'post',
    endpoint: '/todos',
    body: {
      id: 1,
      name: 'foo',
      completed: false,
    },
    schema: schemas.TODO,
  })
})

test('reduce fetch success', t => {
  t.deepEqual(
    reducer(undefined, model.fetch.success({
      result: [1, 2],
    })),
    {
      ids: [1, 2],
    }
  )
})

test('reduce create success', t => {
  t.deepEqual(
    reducer(undefined, model.fetch.success({
      result: [1],
    })),
    {
      ids: [1],
    }
  )
})
