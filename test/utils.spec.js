import test from 'ava'
import * as utils from 'utils'

test('is.namespace', t => {
  t.true(utils.is.namespace('foo'))
  t.true(utils.is.namespace('foo::bar'))
  t.false(utils.is.namespace(':foo'))
  t.true(utils.is.namespace('FOO'))
  t.true(utils.is.namespace('fOO'))
})

test('is.actionCreator', t => {
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

  t.true(utils.is.actionCreator(pattern1))
  t.false(utils.is.actionCreator(pattern2))
  t.false(utils.is.actionCreator(pattern3))
})
