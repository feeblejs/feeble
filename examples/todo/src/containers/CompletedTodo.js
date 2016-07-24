import React, { Component, PropTypes } from 'react'
import { connect } from 'tuku/redux'
import { browserHistory } from 'tuku/router'
import { Tabs, Tab } from 'material-ui/Tabs'
import entityModel from '../models/entity'
import todoModel from '../models/todo/completed'
import TodoList from '../components/TodoList'

class CompletedTodo extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(todoModel.fetch())
  }

  handleCheck = todo => event => {
    const { dispatch } = this.props
    dispatch(todoModel.uncomplete(todo))
  }

  render() {
    const { todos } = this.props

    return (
      <Tabs value="completed">
        <Tab label="Active" value="active" onActive={() => browserHistory.push('/')} />
        <Tab label="Completed" value="completed" onActive={() => browserHistory.push('/completed')}>
          <div>
            <TodoList todos={todos} handleCheck={this.handleCheck} />
          </div>
        </Tab>
      </Tabs>

    )
  }
}

CompletedTodo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  todos: PropTypes.array.isRequired,
}

export default connect(
  () => ({
    todos: entityModel.select('entities')('todo', todoModel),
  })
)(CompletedTodo)
