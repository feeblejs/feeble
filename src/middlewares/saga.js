import createMiddleware from 'redux-saga'
import { fork } from 'redux-saga/effects'

function createSagaMiddleware(models) {
  const saga = function* () {
    yield models.filter(model => model.getEffects().length > 0)
                .map(model => fork(function* () {
                  yield model.getEffects().map(fork)
                }))
  }
  const middleware = createMiddleware()
  const originRun = middleware.run
  middleware.run = () => {
    originRun.call(middleware, saga)
  }
  return middleware
}

export default createSagaMiddleware
