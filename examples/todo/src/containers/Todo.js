import React, { Component } from 'react'
import { connect } from 'tuku/redux'
import todoModel from '../models/todo'
import { TextField, List, ListItem, Checkbox } from 'material-ui'
import TodoItem from '../components/TodoItem'

class Todo extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(todoModel.fetch())
  }

  handleSubmit = event => {
    const { dispatch } = this.props
    dispatch(todoModel.create({ name: this.textField.input.value }))
    event.target.reset()
    event.preventDefault()
  }

  handleCheck = todo => event => {
    const { dispatch } = this.props
    todo = { ...todo, completed: event.target.checked }
    dispatch(todoModel.update(todo))
  }

  render() {
    const { todos } = this.props

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            ref={ref => this.textField = ref}
            style={{ width: '100%' }}
            hintText="What to do?"
          />
        </form>
        <List>
          {Object.values(todos).map(todo =>
            <TodoItem key={todo.id} todo={todo} handleCheck={this.handleCheck} />
          )}
        </List>
      </div>
    )
  }
}

export default connect(
  state => ({
    todos: state.todo
  })
)(Todo)
