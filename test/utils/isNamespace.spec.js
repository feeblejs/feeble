import isNamespace from 'utils/isNamespace'

test('isNamspace', () => {
  expect(isNamespace('foo')).toBe(true)
  expect(isNamespace('foo::bar')).toBe(true)
  expect(isNamespace(':foo')).toBe(false)
  expect(isNamespace('FOO')).toBe(true)
  expect(isNamespace('fOO')).toBe(true)
})
