import { createEpicMiddleware as createMiddleware, combineEpics } from 'redux-observable'

export default function createEpicMiddleware(models) {
  const epics = models.map(model => model.getEpic())
  const rootEpic = combineEpics(...epics)
  return createMiddleware(rootEpic)
}
