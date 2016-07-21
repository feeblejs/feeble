import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { ListItem, Checkbox } from 'material-ui'

function getStyles() {
  return StyleSheet.create({
    completed: {
      textDecoration: "line-through",
    }
  })
}

export default function TodoItem({ todo, handleCheck }) {
  const styles = getStyles()
  const checkbox = <Checkbox checked={todo.completed} onCheck={handleCheck(todo)} />

  return (
    <ListItem key={todo.id} leftCheckbox={checkbox}>
      <span className={todo.completed ? css(styles.completed) : null}>
        {todo.name}
      </span>
    </ListItem>
  )
}
