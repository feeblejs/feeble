import 'babel-polyfill'
import tuku from 'tuku'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger'
import routes from './routes'
import TodoActive from './models/todo/active'
import TodoCompleted from './models/todo/completed'
import Form from './models/form'
import Entity from './models/entity'
import injectTapEventPlugin from 'react-tap-event-plugin'
import callApi from './helpers/callApi'

injectTapEventPlugin()

const app = tuku({
  callApi,
})

app.model(
  TodoActive,
  TodoCompleted,
  Form,
  Entity
)

app.middleware(
  createLogger()
)

app.router(routes)

const tree = app.start()

ReactDOM.render(tree, document.getElementById('app'))
