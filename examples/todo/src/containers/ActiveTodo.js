import React, { Component, PropTypes } from 'react'
import { connect } from 'feeble'
import { push } from 'feeble/router'
import { Tabs, Tab } from 'material-ui/Tabs'
import { reset } from 'redux-form'
import Todo from '../models/todo/active'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'

class ActiveTodo extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    todos: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(Todo.fetch())
  }

  handleSubmit = todo => {
    const { dispatch } = this.props
    dispatch(Todo.create(todo))
    dispatch(reset('todo'))
  }

  handleCheck = todo => event => {
    const { dispatch } = this.props
    dispatch(Todo.complete(todo))
  }

  render() {
    const { todos, dispatch } = this.props

    return (
      <Tabs value="active">
        <Tab label="Active" value="active" onActive={() => dispatch(push('/'))}>
          <TodoForm onSubmit={this.handleSubmit} />
          <TodoList todos={todos} handleCheck={this.handleCheck} />
        </Tab>
        <Tab label="Completed" value="completed" onActive={() => dispatch(push('/completed'))} />
      </Tabs>
    )
  }
}

export default connect(
  () => ({
    todos: Todo.select('list'),
  })
)(ActiveTodo)
