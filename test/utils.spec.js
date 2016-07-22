import test from 'ava'
import * as utils from 'utils'

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

  t.true(utils.isActionCreator(pattern1))
  t.false(utils.isActionCreator(pattern2))
  t.false(utils.isActionCreator(pattern3))
})
