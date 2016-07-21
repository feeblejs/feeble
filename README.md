<h1 align="center">tuku</h1>

<div align="center">
  <strong>React + Redux Architecture</strong>
</div>

## Example

```javascript
import React from 'react';
import tuku, { connect } from 'tuku';
import { Router, Route } from 'tuku/router';

// 1. Create a app
const app = tuku();

// 2.1 Create model
const counter = tuku.model({
  namespace: 'counter',
  state: 0,
});

// 2.2 Create action creator
counter.action('increament')
counter.action('decreament')

// 2.3 Create reducer
counter.reducer(on => {
  on(counter.increament, state => state + 1)
  on(counter.decreament, state => state - 1)
})

// 3. Create view
const App = connect(({ count }) => ({
  count
}))(function(props) {
  return (
    <div>
      <h2>{ props.count }</h2>
      <button key="add" onClick={() => { props.dispatch(counter.increament())}}>+</button>
      <button key="minus" onClick={() => { props.dispatch(counter.decreament)}}>-</button>
    </div>
  );
});

// 4. Create router
app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
);

// 5. Start
const tree = app.start();

// 6. Render our app to dom
ReactDom.render(tree, document.getElementById('root'))
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
