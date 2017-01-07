import isActionCreator from 'utils/isActionCreator'

test('isActionCreator', () => {
  const pattern1 = {
    toString: () => 'foo',
    getType: () => 'foo',
  }

  const pattern2 = {
    toString: () => 'foo',
    getType: () => 'bar',
  }

  const pattern3 = {
    toString: 'foo',
    getType: 'bar',
  }

  expect(isActionCreator(pattern1)).toBe(true)
  expect(isActionCreator(pattern2)).toBe(false)
  expect(isActionCreator(pattern3)).toBe(false)
})
