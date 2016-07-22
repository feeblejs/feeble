import { isActionCreator } from './utils'

export default function wrapSaga(module, methods) {
  const newModule = Object.assign({}, module)

  methods.map(methodName => {
    newModule[methodName] = (pattern, ...args) => {
      if (isActionCreator(pattern)) {
        pattern = pattern.getType()
      }
      return module[methodName](pattern, ...args)
    }
  })

  return newModule
}
