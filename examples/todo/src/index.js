import 'babel-polyfill'
import tuku from 'tuku'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger'
import routes from './routes'
import todo from './models/todo'

const app = tuku()

app.model(todo)

app.middleware(createLogger())

app.router(routes)

const tree = app.start()

ReactDOM.render(tree, document.getElementById('app'))
