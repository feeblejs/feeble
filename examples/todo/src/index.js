import feeble from 'feeble'
import router from 'feeble-router'
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

const app = feeble({
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

app.use(router)

const tree = app.router(routes)

ReactDOM.render(tree, document.getElementById('app'))
