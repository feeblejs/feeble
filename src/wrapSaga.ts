import isActionCreator from './utils/isActionCreator'
import * as _ from 'lodash'

export default function wrapSaga(module: any, methods: string[]) {
  const newModule = (<any>Object).assign({}, module)

  methods.forEach(methodName => {
    newModule[methodName] = (pattern: any, ...args: any[]) => {
      if (isActionCreator(pattern)) {
        pattern = pattern.getType()
      }
      if (_.isArray(pattern)) {
        pattern = pattern.map((p: any) => (isActionCreator(p) ? p.getType() : p))
      }
      return module[methodName](pattern, ...args)
    }
  })

  return newModule
}
