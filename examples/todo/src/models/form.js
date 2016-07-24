import tuku from 'tuku'
import { reducer } from 'redux-form'

const model = tuku.model({
  namespace: 'form',
})

model.setReducer(reducer)

export default model
