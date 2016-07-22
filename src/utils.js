import { NAMESPACE_PATTERN } from './constants'

export const is = {
  undef:         v => v === null || v === undefined,
  notUndef:      v => v !== null && v !== undefined,
  func:          v => typeof v === 'function',
  namespace:     v => typeof v === 'string' && new RegExp(NAMESPACE_PATTERN).test(v),
  actionCreator: v => is.func(v.toString) && is.func(v.getType) && v.toString() === v.getType(),
}
