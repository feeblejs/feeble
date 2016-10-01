import createMiddleware from 'redux-saga'
import { Task } from "redux-saga/types";
import { fork } from 'redux-saga/effects'

declare module "redux-saga" {
  interface SagaMiddleware {
    run(): Task;
  }
}

function createSagaMiddleware(models: any[]) {
  const saga = function* () {
    yield models.filter(model => model.getEffect()).map(model => fork(model.getEffect()))
  }
  const middleware = createMiddleware()
  const originRun = middleware.run
  middleware.run = (): Task => {
    return originRun.call(middleware, saga)
  }
  return middleware
}

export default createSagaMiddleware
