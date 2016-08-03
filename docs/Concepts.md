# Concepts

Feeble structures all your logic to a `app` and the only concept Feeble introduced is `model`, `model` let you model your domain's actions, reducer, effects, and selectors in one place.

## Model

A `model` is a object contains `state`, `actions`, `reducer`, `effects`, `selectors`.

Here's a typical model example:

```javascript
const count = feeble.model({
  namespace: 'count',
  state: 0,
})

count.action('increament')

count.reducer(on => {
  on(count.increament, state => state + 1)
})
```

Let's walk through above example line by line to see what dose it do.

First, we create a `model` using `feeble.model`, and giving it a namespace which is required for a model, and a initial state.

Then, we define a `increament` action creator by calling `count.action`, and we can use `count.increament` to reference this action creator later.

Last, we create `reducer` by calling `count.reducer`, `counter.reducer` accept a function which takes a `on` param, you can use `on` to register actions to reducer.

`action creator` and `reducer` are all Redux's concepts, so what is `effects`?

Feeble using `redux-saga` to handle side effects, so `effect` is a `saga` actually. Let's define a `effect` for above `count` model.

```javascript
model.effect(function* {
  yield* takeEvery(count.increament, function* ({ payload }) {
    yield call(localStorage.setItem, 'count', payload)
  })
})
```

When you attach model to the `app`, Feeble will run your saga automaticly.
