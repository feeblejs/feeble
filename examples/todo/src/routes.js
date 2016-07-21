import React from 'react'
import { Router, IndexRoute, Route } from 'tuku/router'
import App from './containers/App'
import Todo from './containers/Todo'

export default function routes({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Todo} />
      </Route>
    </Router>
  )
}
