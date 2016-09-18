import isFunction from 'lodash/isFunction'

export default function isActionCreator(v) {
  return isFunction(v.toString) && isFunction(v.getType) && v.toString() === v.getType()
}
