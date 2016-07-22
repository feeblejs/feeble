export function isActionCreator(pattern) {
  return typeof pattern.toString === 'function' &&
    typeof pattern.getType === 'function' &&
    pattern.toString() === pattern.getType()
}
