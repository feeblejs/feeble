import 'babel-polyfill'
import tuku from 'tuku'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger'
import routes from './routes'
import todoActive from './models/todo/active'
import todoCompleted from './models/todo/completed'
import form from './models/form'
import entity from './models/entity'
import injectTapEventPlugin from 'react-tap-event-plugin'
import callApi from './helpers/callApi'

injectTapEventPlugin()

const app = tuku({
  callApi,
})

app.model(
  todoActive,
  todoCompleted,
  form,
  entity
)

app.middleware(
  createLogger()
)

app.router(routes)

const tree = app.start()

ReactDOM.render(tree, document.getElementById('app'))
