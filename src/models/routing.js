import model from '../model'
import { routerReducer } from 'react-router-redux'

const routing = model({
  namespace: 'routing',
})

routing.addReducer(routerReducer)

export default routing
