import feeble from 'feeble'
import { reducer } from 'redux-form'

const model = feeble.model({
  namespace: 'form',
})

model.setReducer(reducer)

export default model
