import tuku from '../src'
import App from './containers/App'

const app = tuku()

const counter = tuku.model({
  namespace: 'counter',
  state: 0,
})

increment = counter.action('increment')

decrement = counter.action('decrement')

counter.reducer(on => {
  on(increment, state => state + 1)

  on(decrement, state => state - 1)
})

counter.effect(function* () {

})

app.model(counter)

app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
);

app.start(document.getElementById('root'));
