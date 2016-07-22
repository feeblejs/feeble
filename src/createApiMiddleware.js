import typeSet from './typeSet'
import CALL_API from './CALL_API'
import omit from 'lodash/omit'

export default function createApiMiddle(fetch) {
  return store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
      return next(action)
    }

    const { types, endpoint } = callAPI // eslint-disable-line

    if (typeof endpoint === 'function') {
      callAPI.endpoint = endpoint(store.getState())
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
      payload: omit(callAPI, 'types'),
      meta: action.meta,
    }))

    return fetch(callAPI, action)
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
