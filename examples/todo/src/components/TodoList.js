import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { List, ListItem, Checkbox } from 'material-ui'

const styles = StyleSheet.create({
  completed: {
    textDecoration: "line-through",
  }
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

export default function TodoList({ todos, handleCheck }) {
  return (
    <List>
      {todos.map(todo =>
        <TodoItem key={todo.id} todo={todo} handleCheck={handleCheck} />
      )}
    </List>
  )
}
