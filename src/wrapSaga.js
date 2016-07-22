import { isActionCreator } from './utils'
import isArray from 'lodash/isArray'

export default function wrapSaga(module, methods) {
  const newModule = Object.assign({}, module)

  methods.map(methodName => {
    newModule[methodName] = (pattern, ...args) => {
      if (isActionCreator(pattern)) {
        pattern = pattern.getType()
      }
      if (isArray(pattern)) {
        pattern = pattern.map(p => isActionCreator(p) ? p.getType() : p)
      }
      return module[methodName](pattern, ...args)
    }
  })

  return newModule
}
