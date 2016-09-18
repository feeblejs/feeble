import test from 'ava'
import isNamespace from 'utils/isNamespace'

test('isNamspace', t => {
  t.true(isNamespace('foo'))
  t.true(isNamespace('foo::bar'))
  t.false(isNamespace(':foo'))
  t.true(isNamespace('FOO'))
  t.true(isNamespace('fOO'))
})
