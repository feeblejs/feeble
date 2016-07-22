import { is } from './utils'
import isArray from 'lodash/isArray'

export default function wrapSaga(module, methods) {
  const newModule = Object.assign({}, module)

  methods.map(methodName => {
    newModule[methodName] = (pattern, ...args) => {
      if (is.actionCreator(pattern)) {
        pattern = pattern.getType()
      }
      if (isArray(pattern)) {
        pattern = pattern.map(p => is.actionCreator(p) ? p.getType() : p)
      }
      return module[methodName](pattern, ...args)
    }
  })

  return newModule
}
