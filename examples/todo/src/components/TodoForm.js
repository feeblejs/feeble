import React, { Component } from 'react'
import { TextField } from 'material-ui'
import { reduxForm } from 'redux-form'

function TodoForm({ fields, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        style={{ width: '100%' }}
        hintText="What to do?"
        {...fields.name}
      />
    </form>
  )
}

export default reduxForm({
  form: 'todo',
  fields: ['name'],
})(TodoForm)
