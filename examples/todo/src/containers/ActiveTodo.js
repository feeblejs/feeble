import React, { Component } from 'react'
import { connect } from 'tuku/redux'
import { browserHistory } from 'tuku/router'
import { Tabs, Tab } from 'material-ui/Tabs'
import todoFactory from '../models/todo'
import TodoInput from '../components/TodoInput'
import TodoList from '../components/TodoList'

const todoModel = todoFactory('activeTodo')

class ActiveTodo extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(todoModel.fetch({ completed: false }))
  }

  handleSubmit = todo => {
    const { dispatch } = this.props
    dispatch(todoModel.create(todo))
  }

  handleCheck = todo => event => {
    const { dispatch } = this.props
    todo = { ...todo, completed: event.target.checked }
    dispatch(todoModel.update(todo))
  }

  render() {
    const { todos } = this.props

    return (
      <Tabs value="active">
        <Tab label="Active" value="active" onActive={() => browserHistory.push('/') }>
          <TodoInput handleSubmit={this.handleSubmit} />
          <TodoList todos={todos} handleCheck={this.handleCheck} />
        </Tab>
        <Tab label="Completed" value="completed" onActive={() => browserHistory.push('/completed') }>
        </Tab>
      </Tabs>
    )
  }
}

export default connect(
  state => ({
    todos: state.activeTodo
  })
)(ActiveTodo)
