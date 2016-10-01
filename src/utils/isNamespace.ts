import { NAMESPACE_PATTERN } from '../constants'

export default function isNamspace(v: any) {
  return typeof v === 'string' && new RegExp(NAMESPACE_PATTERN).test(v)
}
