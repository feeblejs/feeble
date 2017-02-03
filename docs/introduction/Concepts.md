# Concepts

Feeble structures all your logic to a `app` and the only concept Feeble introduced is `model`, `model` let you model your domain's actions, reducer, epics, and selectors in one place.

## Model

A `model` is a object contains `state`, `actions`, `reducer`, `epics`, `selectors`.

Here's a typical model example:

```javascript
const count = feeble.model({
  namespace: 'count',
  state: 0,
})

count.action('increment')
count.action('double')

count.reducer(on => {
  on(count.increment, state => state + 1)
  on(count.double, state => state * 2)
})
```

Let's walk through above example line by line to see what dose it do.

First, we create a `model` using `feeble.model`, and giving it a namespace which is required for a model, and a initial state.

Then, we define a `increment` action creator by calling `count.action`, and we can use `count.increment` to reference this action creator later.

Last, we create `reducer` by calling `count.reducer`, `counter.reducer` accept a function which takes a `on` param, you can use `on` to register actions to reducer.

`action creator` and `reducer` are all Redux's concepts, so what is `epics`?

Feeble using `redux-observable` to handle side effects, an Epic is the core primitive of redux-observable. Let's define a `epic` for above `count` model.

```javascript
model.epic(action$ =>
  action$.ofType(count.increment)
    .mapTo(count.double())
})
```

This.epic doubles count after you increase it.

When you attach model to the `app`, Feeble will run your saga automaticly.
