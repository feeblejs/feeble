import React, { Component } from 'react'
import { connect, bindActionCreators } from 'tuku/redux'
import todo from '../models/todo'

class App extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(todo.fetch())
  }

  handleSubmit = event => {
    const { dispatch } = this.props
    dispatch(todo.create({ name: this.input.value }))
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
          {todos.map(todo => (
            <li key={todo.id}>{todo.name}</li>
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
