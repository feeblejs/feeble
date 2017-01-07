import model from 'models/todo/active'
import schemas from 'schemas'

const reducer = model.getReducer()

test('basic', () => {
  expect(model.getNamespace()).toBe('todo::active')
  expect(model.getState()).toEqual({ ids: [] })
})

test('action fetch', () => {
  expect(model.fetch().getRequest()).toEqual({
    method: 'get',
    endpoint: '/todos',
    schema: schemas.TODO_ARRAY,
  })
})

test('action create', () => {
  const data = {
    id: 1,
    name: 'foo',
  }
  expect(model.create(data).getRequest()).toEqual({
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

test('reduce fetch success', () => {
  expect(reducer(undefined, model.fetch.success({
    result: [1, 2],
  }))).toEqual({
    ids: [1, 2],
  })
})

test('reduce create success', () => {
  expect(reducer(undefined, model.fetch.success({
    result: [1],
  }))).toEqual({
    ids: [1],
  })
})
