import 'babel-polyfill'
import tuku from 'tuku'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger'
import routes from './routes'
import todoFactory from './models/todo'
import form from './models/form'
import entity from './models/entity'
import injectTapEventPlugin from 'react-tap-event-plugin'
import request from './helpers/request'

injectTapEventPlugin()

const app = tuku({
  request,
})

app.model(todoFactory('todo::active'))
app.model(todoFactory('todo::completed'))
app.model(form)
app.model(entity)

app.middleware(createLogger())

app.router(routes)

const tree = app.start()

ReactDOM.render(tree, document.getElementById('app'))
