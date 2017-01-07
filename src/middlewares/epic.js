import { ActionsObservable, createEpicMiddleware as createMiddleware, combineEpics } from 'redux-observable'

ActionsObservable.prototype.ofAction = function (...actions) {
  return this.ofType(...actions.map(a => a.getType()))
}

export default function createEpicMiddleware(models) {
  const epics = models.map(model => model.getEpic())
  const rootEpic = combineEpics(...epics)
  return createMiddleware(rootEpic)
}
