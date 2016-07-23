import model from '../model'
import { routerReducer } from 'react-router-redux'

const routing = model({
  namespace: 'routing',
})

routing.setReducer(routerReducer)

export default routing
