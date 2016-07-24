import React, { PropTypes } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { List, ListItem, Checkbox } from 'material-ui'

const styles = StyleSheet.create({
  completed: {
    textDecoration: 'line-through',
  },
})

function TodoItem({ todo, handleCheck }) {
  const checkbox = <Checkbox checked={todo.completed} onCheck={handleCheck(todo)} />

  return (
    <ListItem key={todo.id} leftCheckbox={checkbox}>
      <span className={todo.completed ? css(styles.completed) : null}>
        {todo.name}
      </span>
    </ListItem>
  )
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  handleCheck: PropTypes.func.isRequired,
}

export default function TodoList({ todos, handleCheck }) {
  return (
    <List>
      {todos.map(todo =>
        <TodoItem key={todo.id} todo={todo} handleCheck={handleCheck} />
      )}
    </List>
  )
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  handleCheck: PropTypes.func.isRequired,
}
