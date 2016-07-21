import 'babel-polyfill'
import tuku from 'tuku'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger'
import routes from './routes'
import todoFactory from './models/todo'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const app = tuku()

app.model(todoFactory('activeTodo'))
app.model(todoFactory('completedTodo'))

app.middleware(createLogger())

app.router(routes)

const tree = app.start()

ReactDOM.render(tree, document.getElementById('app'))
