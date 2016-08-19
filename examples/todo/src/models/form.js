import feeble from 'feeble'
import { reducer } from 'redux-form'

const model = feeble.model({
  namespace: 'form',
})

model.addReducer(reducer)

export default model
