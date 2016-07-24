import React, { Component, PropTypes } from 'react'
import { connect } from 'tuku/redux'
import { push } from 'tuku/router'
import { Tabs, Tab } from 'material-ui/Tabs'
import { reset } from 'redux-form'
import todoFactory from '../models/todo'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'

const todoModel = todoFactory('todo::active')

class ActiveTodo extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    todos: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(todoModel.fetch())
  }

  handleSubmit = todo => {
    const { dispatch } = this.props
    dispatch(todoModel.create(todo))
    dispatch(reset('todo'))
  }

  handleCheck = todo => event => {
    const { dispatch } = this.props
    const newTodo = { ...todo, completed: event.target.checked }
    dispatch(todoModel.update(newTodo))
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
    todos: todoModel.select('list')(),
  })
)(ActiveTodo)
