<h1 align="center">Feeble</h1>

<div align="center">
  <strong>React + Redux Architecture</strong>
</div>

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
  <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
    alt="API stability" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/tianche/feeble">
    <img src="https://img.shields.io/travis/tianche/feeble/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
</div>


## Introduction

Feeble is a framework built on top of React/Redux/redux-saga which aims to make building React/Redux applications easier and better.

If you are familiar with React/Redux/redux-saga, you'll love Feeble :see_no_evil:.

## Installation

```bash
npm install feeble --save
```

## Example

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import feeble, { connect } from 'feeble'
import { Router, Route } from 'feeble/router'

// 1. Create a app
const app = feeble()

// 2.1 Create model
const counter = feeble.model({
  namespace: 'count',
  state: 0,
})

// 2.2 Create action creators
counter.action('increament')
counter.action('decreament')

// 2.3 Create reducer
counter.reducer(on => {
  on(counter.increament, state => state + 1)
  on(counter.decreament, state => state - 1)
})

// 2.4 Attach model to the app
app.model(counter)

// 3. Create view
const App = connect(({ count }) => ({
  count
}))(function({ dispatch, count }) {
  return (
    <div>
      <h2>{ count }</h2>
      <button key="inc" onClick={() => { dispatch(counter.increament()) }}>+</button>
      <button key="dec" onClick={() => { dispatch(counter.decreament()) }}>-</button>
    </div>
  )
})

// 4. Create router
app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
)

// 5. Start the app
const tree = app.start()

// 6. Render to DOM
ReactDOM.render(tree, document.getElementById('root'))
```

For more complex examples, please see [/examples](/examples).

## Documentation

* [Concepts](/docs/Concepts.md)
* [API Reference](/docs/API.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)
