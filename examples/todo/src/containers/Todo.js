import React from 'react'
import ActiveTodo from './ActiveTodo'
import CompletedTodo from './CompletedTodo'

export default function Todo() {
  return (
    <Tabs>
      <Tab label="Active" onActive={() => browserHistory('/') }>
        <ActiveTodo />
      </Tab>
      <Tab label="Completed" onActive={() => browserHistory('/completed') }>
        <CompletedTodo />
      </Tab>
    </Tabs>
  )
}
