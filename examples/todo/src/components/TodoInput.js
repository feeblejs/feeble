import React, { Component } from 'react'
import { TextField } from 'material-ui'

export default class TodoInput extends Component {
  handleSubmit = event => {
     this.props.handleSubmit({
      name: this.textField.input.value,
      completed: false,
    })
    this.textField.input.value = ''
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          ref={ref => this.textField = ref}
          style={{ width: '100%' }}
          hintText="What to do?"
        />
      </form>
    )
  }
}
