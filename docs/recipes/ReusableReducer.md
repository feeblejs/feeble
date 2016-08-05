# Reusable Reducer

As feeble's model allow you create multiple reducers, you can use this feature to write reusable reducers.

Let's say we have a post list and user list on the UI, a post model and a user model keep these lists's state.

```javascript
// models/post.js
const post = feeble.model({
  namespace: 'post',
  state: {
    loading: false,
    data: [],
  }
})

post.action('fetch', () => {
  method: 'get',
  endpoint: '/posts',
})

post.reducer(on => {
  on(post.fetch.request, state => ({
    ...state,
    loading: true,
  }))

  on(post.fetch.success, (state, payload) => ({
    ...state,
    loading: true,
    data: payload,
  }))
})
```

```javascript
// models/user.js
const user = feeble.model({
  namespace: 'user',
  state: {
    loading: false,
    data: [],
  }
})

user.action('fetch', () => {
  method: 'get',
  endpoint: '/users',
})

user.reducer(on => {
  on(user.fetch.request, state => ({
    ...state,
    loading: true,
  }))

  on(user.fetch.success, (state, payload) => ({
    ...state,
    loading: true,
    data: payload,
  }))
})
```

These two models are 90% similar, especially the reducer. Let's extract the reducer to `models/conerns/list.js`:

```javascript
export default function list(fetch) {
  return on => {
    on(fetch.request, state => ({
      ...state,
      loading: true,
    }))

    on(fetch.success, (state, payload) => ({
      ...state,
      loading: true,
      data: payload,
    }))
  }
}
```

Applying the `list` to these models:

```javascript
// models/post.js
import list from './concerns/list'

const post = feeble.model({
  namespace: 'post',
  state: {
    loading: false,
    data: [],
  }
})

post.action('fetch', () => {
  method: 'get',
  endpoint: '/posts',
})

post.reducer(list(fetch))
```

```javascript
// models/user.js
import list from './concerns/list'

const user = feeble.model({
  namespace: 'user',
  state: {
    loading: false,
    data: [],
  }
})

user.action('fetch', () => {
  method: 'get',
  endpoint: '/users',
})

user.reducer(list(fetch))

// You can create more reducers for other actions
// user.reducer(...)
```
