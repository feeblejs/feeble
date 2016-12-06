import { CALL_API } from '../constants'
import * as _ from 'lodash'

export default function createApiMiddleware(callAPI: (...arg: any[]) => Promise<void>) {
  return (store: any) => (next: any) => (action: any) => {
    const request = action[CALL_API]
    if (typeof request === 'undefined') {
      return next(action)
    }

    const { types, endpoint } = request // eslint-disable-line

    if (typeof endpoint === 'function') {
      request.endpoint = endpoint(store.getState())
    }

    function actionWith(data: any) {
      const meta = (<any>Object).assign({}, data.meta, action.meta)
      const finalAction = (<any>Object).assign({}, data, { meta })
      return finalAction
    }

    const [requestType, successType, errorType] = types

    next(actionWith({
      type: requestType,
      payload: _.omit(request, 'types'),
      meta: action.meta,
    }))

    return callAPI(request, action)
      .then(
        (action: any) => {
          next(actionWith((<any>Object).assign({}, action, { type: successType })))
          return action.payload
        },
        (action: any) => {
          next(actionWith((<any>Object).assign({}, action, { type: errorType })))
          return action.payload
        }
      )
  }
}
