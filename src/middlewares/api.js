import { CALL_API } from '../constants'
import omit from 'lodash/omit'

export default function createApiMiddleware(callAPI) {
  return store => next => action => {
    const request = action[CALL_API]
    if (typeof request === 'undefined') {
      return next(action)
    }

    const { types, endpoint } = request // eslint-disable-line

    if (typeof endpoint === 'function') {
      request.endpoint = endpoint(store.getState())
    }

    function actionWith(data) {
      const finalAction = {
        ...data,
        meta: {
          ...data.meta,
          ...action.meta,
        },
      }
      return finalAction
    }

    const [requestType, successType, errorType] = types

    next(actionWith({
      type: requestType,
      payload: omit(request, 'types'),
      meta: action.meta,
    }))

    return callAPI(request, action)
      .then(
        action => {
          next(actionWith({
            ...action,
            type: successType,
          }))
          return action.payload
        },
        action => {
          next(actionWith({
            ...action,
            type: errorType,
          }))
          return action.payload
        }
      )
  }
}
