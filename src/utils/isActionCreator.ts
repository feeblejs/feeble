import * as _ from 'lodash'

export default function isActionCreator(v: any) {
  return _.isFunction(v.toString) && _.isFunction(v.getType) && v.toString() === v.getType()
}
