const saga = require('redux-saga')
const wrapSaga = require('../lib/wrapSaga').default

module.exports = wrapSaga(saga, ['takeEvery', 'takeLatest'])
