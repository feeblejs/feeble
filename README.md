<h1 align="center">Tuku</h1>

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
  <a href="https://travis-ci.org/tianche/tuku">
    <img src="https://img.shields.io/travis/tianche/tuku/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
</div>


## Introduction

Tuku is a framework build on top of React/Redux/redux-saga which aims to make building React/Redux applications easier and better.

It introduces `app` and `model` concept, `app` holds all the logic of your applications, and `model` contains your specify domain's actions, reducer, effects and selectors. This make you struct your application more elegant.

If you are familiar with React/Redux/redux-saga, you'll love Tuku :see_no_evil:.

## Basic Usage

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import tuku from 'tuku'
import { connect } from 'tuku/redux'
import { Router, Route } from 'tuku/router'

// 1. Create a app
const app = tuku()

// 2.1 Create model
const counter = tuku.model({
  namespace: 'count',
  state: 0,
})

// 2.2 Create action creator
counter.action('increament')
counter.action('decreament')

// 2.3 Create reducer
counter.reducer(on => {
  on(counter.increament, state => state + 1)
  on(counter.decreament, state => state - 1)
})

// 2.4 Attach model to app
app.model(counter)

// 3. Create view
const App = connect(({ count }) => ({
  count
}))(function({ dispatch, count }) {
  return (
    <div>
      <h2>{ count }</h2>
      <button key="inc" onClick={() => { dispatch(counter.increament()}}>+</button>
      <button key="dec" onClick={() => { dispatch(counter.decreament()}}>-</button>
    </div>
  )
})

// 4. Create router
app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
)

// 5. Start app
const tree = app.start()

// 6. Render to DOM
ReactDOM.render(tree, document.getElementById('root'))
```

Play above live example on [RequireBin](http://requirebin.com/?gist=9dd0f0cfffa4862989bded30865f6af7).

For more complicate examples, please see [/examples](/examples).

## License

[MIT](https://tldrlegal.com/license/mit-license)
