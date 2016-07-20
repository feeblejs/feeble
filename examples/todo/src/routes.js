import React from 'react'
import { Router, Route } from 'tuku/router'
import App from './containers/App'

export default function routes({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  )
}
