import React, { Component } from 'react'
import { connect, bindActionCreators } from 'tuku/redux'
import todo from '../models/todo'

class App extends Component {
  handleSubmit = event => {
    const { dispatch } = this.props
    dispatch(todo.add(this.input.value))
    event.target.reset()
    event.preventDefault()
  }

  render() {
    const { todos } = this.props

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input ref={ref => this.input = ref} type="text" />
        </form>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default connect(
  state => ({
    todos: state.todo
  })
)(App)
