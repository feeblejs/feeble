import createMiddleware from 'redux-saga'
import { fork } from 'redux-saga/effects'

function createSagaMiddleware(models) {
  const saga = function* () {
    yield models.map(model => fork(model.getEffect()))
  }
  const middleware = createMiddleware()
  const originRun = middleware.run
  middleware.run = () => {
    originRun.call(middleware, saga)
  }
  return middleware
}

export default createSagaMiddleware
