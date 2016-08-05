# Tutorial

Let's build a small todo application using feeble. This tutorial assumes you're familiar with a few things:

* [React](https://facebook.github.io/react)
* [Redux](http://redux.js.org)
* [redux-saga](http://yelouafi.github.io/redux-saga)
* Some ES6 syntax

## Boilerplate

We will use [create-react-app](https://github.com/facebookincubator/create-react-app) to setup our app in this tutorial.

```bash
npm i -g create-react-app

create-react-app todo
cd todo/
npm i feeble babel-polyfill --save
npm start
```

Edit `src/index.js` to setup feeble:

```
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import feeble from 'feeble':
import { Router, Route } from 'feeble/router';
import App from './App';
import './index.css';

const app = feeble();

app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
);

const tree = app.start();

ReactDOM.render(
  tree,
  document.getElementById('root')
);
```

## Creating todo model

We'll start building our application by creating a todo `model`. Create `src/todo.js` and add following snippets:

```javascript
import feeble from 'feeble';

const todo = feeble.model({
  namespace: 'todo',
  state: ['Workout'],
});

export default todo
```

## Attaching model to the app

After creating model, we need attach the model to the app, edit `src/index.js` again, add following lines:

```javascript
// ...
import Todo from './todo'; // <== Import todo model

const app = feeble();

app.model(Todo); // <== Attach to the app
```

## Redndering our data

Ok, It's times render our todo list.

```javascript
import React, { Component } from 'react';
import { connect } from 'feeble';
import Todo from './todo';

class App extends Component {
  render() {
    const { todos } = this.props;

    return (
      <div>
        <ul>
          {todos.map((todo, index) =>
            <li key={index}>{todo}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default connect(() => ({
  todos: Todo.getState() // <== Get data directly from Todo model
}))(App);
```

Look at your browser, the page should shows a `Workout` todo now.

## Adding items

Let's go back our todo model and remove the sample items. Then add a `add` action and the `reducer`:

```javascript
const todo = feeble.model({
  namespace: 'todo',
  state: [],
})

todo.action('add')

todo.reducer(on => {
  on(todo.add, (state, payload) => [...state, payload])
})
```

Then add a input to our view:

```javascript
import React, { Component } from 'react';
import { connect } from 'feeble';
import Todo from './todo';

class App extends Component {
  handleSubmit = event => {
    event.preventDefault()
    this.props.dispatch(Todo.add(this.input.value))
    this.input.value = ''
  }

  render() {
    const { todos } = this.props;

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={this.handleSubmit}>
            <input ref={ref => (this.input = ref)} placeholder="What needs to be done?" />
          </form>
        </header>
        <ul>
          {todos.map((todo, index) =>
            <li key={index}>{todo}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default connect(() => ({
  todos: Todo.getState()
}))(App);
```

Look at your application again, and type something on the input then press `enter`， you will see item is added to the list.
