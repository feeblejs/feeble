# API Reference

* [`feeble API`](#feeble-api)
  * [feeble(options)](#feebleoptions)
  * [feeble.model(options)](#feeblemodeloptions)
  * [connect(mapStateToProps, mapDispatchToProps, mergeProps, options)](#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
* [`app API`](#app-api)
  * [app.model(...args)](#appmodelargs)
  * [app.middleware(..args)](#appmiddlewareargs)
  * [app.router(routes)](#approuterroutes)
  * [app.start()](#appstart)
  * [app.mount(component)](#appmountcomponent)
  * [app.tree()](#apptree)
  * [app.store](#appstore)
* [`model API`](#model-api)
  * [model.action(name, fn, fn)](#modelactionname-fn-fn)
  * [model.apiAction(name, fn, fn)](#modelapiactionname-fn-fn)
  * [model.reducer(fn)](#modelreducerfn)
  * [model.selector(name, ...fns, fn, options)](#modelselectorname-fns-fn-options)
  * [model.select(name, ...args)](#modelselectname-args)
  * [model.effect(fn)](#modeleffectfn)
  * [model.setReducer(fn)](#modelsetreducerfn)
  * [model.getState()](#modelgetstate)

## feeble API

### `feeble(options)`

Create a feeble app.

* `options: Object` - A list of options to pass to the app, currently supported options are:
  * `callApi: Function` - A function interact wiht server, if this option is presented, Feeble will add a api middleware to Redux store, see more details for [api middleware](#todo).

### `feeble.model(options)`

Create a model.

* `options: Object` - A list of options to pass to the model, currently supported options are:
  * `namespace: String` - Namespace of the model, this is required. Namespace can be nested by a double colon `::`.
  * `state: any` - Initial state of the model.

### `connect(mapStateToProps, mapDispatchToProps, mergeProps, options)`

Same as `react-redux`'s [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

## app API

### `app.model(...args)`

* `args: Array<any>` - An array of models.

Attach one or multiple models to the app. The app's initial state tree will generate from attached model's namespace and initial state. And model's reducer will mount to the specify node by model's namespace.

#### Example

```javascript
const app = feeble()

const count = feeble.model({
  namespace: 'count',
  state: 0,
})

const todoA = feeble.model({
  namespace: 'todo::a',
  state: [ 'bar' ],
})

const todoB = feeble.model({
  namespace: 'todo::b',
  state: [ 'foo' ],
})

app.model(count, todoA, todoB)
```

Above example will generate following state tree:

```javascript
{
  count: 0,
  todo: {
    a: [ 'bar' ],
    b: [ 'foo' ],
  },
}
```

And `count`'s reducer will mount to `count`, `todoA`'s reducer will mount to `todo.a`, `todoB`'s reducer will mount to `todo.b`. Namespace is a good way to split you large application to small modules.

### `app.middleware(...args)`

* `args: Array<any>` - An array of middlewares

Apply Redux middlewares to your app.


### `app.router(routes)`

* `routes: Router` - Route configuration.


### `app.start()`

Bootstrap your app, `app.start` return app's root React instance and you can render it to DOM.

#### Example

```javascript
const app = feeble()
const tree = app.start()
ReactDOM.render(tree, document.getElementById('app'))
```

### `app.mount(component)`

* `component: Component` - A React component instance.

Mount a component the you app, it's useful when you want testing your [container components](https://github.com/reactjs/redux/blob/master/docs/basics/UsageWithReact.md#presentational-and-container-components).

#### Example

```javascript
import test from 'ava'
import app from './app' // <== yor app
import { mount } from 'enzyme'
import React from 'react'
import Counter from 'containers/Counter' // <== Container component you want test

test('todo', t => {
 const wrapper = mount(app.mount(<Counter />))

 wrapper.find('#increament').simulate('click')

 t.is(app.store.getState().count, 1)
})
```

### `app.tree()`

Access your app's root React instance.

### `app.store`

Access Redux store.

## model API

### `model.action(name, [fn], [fn])`

Create a action creator.

* `name: String`: Name of the action creator, the name should be validate JavaScript function name, because action creator will be a method of model.
* `fn: Function`: Transform multiple arguments as the payload. If you omit this param, the first argument pass to action creator will be the payload.
* `fn: Function`: Transform multiple arguments as the meta.

#### Example

```javascript
const foo = feeble.model({
  namespace: 'foo'
})

// create a "simple" method on "foo"
foo.action('simple')
// produce "{ type: 'todo::simple', payload: 'blah' }"
foo.simple('blah')

// create a "better" method on "foo"
foo.action('better', str => str + str)
// produce "{ type: 'todo::better', payload: 'blah blah' }"
foo.better('blah')

// create a "best" method on "foo"
foo.action('best', str => str + str, str => str.toUpperCase())
// produce "{ type: 'todo::best', payload: 'blah blah', meta: 'BLAH' }"
foo.best('blah')
```

### `model.apiAction(name, fn, [fn])`

Create a API call action creator.

If set `callApi` option to `app`, model will expose `apiAction` to allow you create API call action creator.

* `name: String` -  Name of the action creator.
* `fn: Function`: Transform multiple arguments as the api request.
* `fn: Function`: Transform multiple arguments as the meta.

#### Example

```javascript
const todo = feeble.model({
  namespace: 'todo',
  state: [],
})

todo.apiAction('create', name => ({
  method: 'post',
  endpoint: '/todos',
  body: { name },
}))
```

When you call `todo.create('Workout')` will produce following action:

```javascript
{
  types: ['todo::create_request', 'todo::create_success', 'todo::create_error'],
  [CALL_API]: {
    method: 'post',
    endpoint: '/todos',
    body: { name },
  },
}
```

When api middleware find a [CALL_API] property in the action, it will dispatch a request action and pass the "CALL_API" object to your "callApi" function, here is the request action:

```javascript
{
  type: 'todo::create_request',
  payload: {
    method: 'post',
    endpoint: '/todos',
    body: { name },
  }
}
```

Then, api api middleware calls your "callApi" function, after "callApi" returns promise resolved, following action will be dispatched:

```javascript
{
  type: 'todo::create_success',
  payload: {
    name: 'Workout'
  }
}
```

If "callApi" rejects, a error action will be dispatched:

```javascript
{
  type: 'todo::create_error',
  payload: "errors from server",
  error: true,
}
```

### `model.reducer(fn)`

Create reducer.

* `fn: Function` - A function takes a `on` param which register action to the reducer.

#### Example

```javascript
count.reducer(on => {
  on(todo.increment, (state, payload) => state + payload)
  on(todo.decrement, (state, payload) => state + payload)
})
```

### `model.selector(name, ...fns, fn, options)`

* `name: Function` - Name of the selector, access the selector by calling `model.select(name)` later.
* `fns: Array<Function>` - Input selectors.
* `fn: Function` - Result function.
* `options: Object` - A list of options, currently supported options are:
  * `structured: Boolean` - Create a structured selector if true.

### `model.select(name, ...args)`

Access selectors.

* `name: Function` - Name of the selector.
* `args: Array<any>` - Arguments pass to the selector.

### `model.effect(fn)`

Create effect.

* `fn: Function` - A generator function.

### Example

```javascript
model.effect(function* {
  yield* takeEvery(count.increament, function* ({ payload }) {
    yield call(localStorage.setItem, 'count', payload)
  })
})
```

Using `fork` to create multiple effects:

```javascript
model.effect(function* {
  yield [
    fork(effect1),
    fork(effect2),
  ]
})
```

### `model.setReducer(fn)`

Add a exists reducer to model. This is useful when you work with third party libraries or you legacy codes.

* `fn: Function` - A normal Redux reducer.

### `model.getState()`

Get current model state.
