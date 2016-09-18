const effects = require('redux-saga/effects')
const wrapSaga = require('./lib/wrapSaga').default

module.exports = wrapSaga(effects, ['take', 'takem', 'actionChannel'])
