import test from 'ava'
import isActionCreator from 'utils/isActionCreator'

test('isActionCreator', t => {
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

  t.true(isActionCreator(pattern1))
  t.false(isActionCreator(pattern2))
  t.false(isActionCreator(pattern3))
})
