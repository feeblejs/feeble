import { Schema, arrayOf } from 'normalizr'

const todo = new Schema('todo')

export default {
  TODO: todo,
  TODO_ARRAY: arrayOf(todo),
}
