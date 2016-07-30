import test from 'ava'
import sinon from 'sinon'
import { CALL_API } from '../../src/constants'
import createApi from 'middlewares/api'

function callAPI(callAPI, action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (action.meta.success) {
        resolve({ payload: { name: 'ava' } })
      } else {
        reject({ payload: 'i am a error', error: true })
      }
    })
  })
}

const store = {
  getState() {
    return {}
  },
}

let api = createApi(callAPI)

test('CALL_API not given', t => {
  const next = sinon.spy()
  const action = { type: 'INCREMENT' }
  api(store)(next)(action)

  t.true(next.calledOnce)
  t.true(next.calledWith(action))
})

test('call api success', t => {
  const next = sinon.spy()

  const action = {
    [CALL_API]: {
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint: '/users',
      query: { active: true },
    },
    meta: {
      age: 18,
      success: true,
    },
  }

  return api(store)(next)(action).then(() => {
    t.true(next.calledTwice)

    t.deepEqual(next.firstCall.args[0], {
      type: 'FETCH_REQUEST',
      payload: {
        method: 'get',
        endpoint: '/users',
        query: { active: true },
      },
      meta: {
        age: 18,
        success: true,
      },
    })

    t.deepEqual(next.secondCall.args[0], {
      type: 'FETCH_SUCCESS',
      payload: {
        name: 'ava',
      },
      meta: {
        age: 18,
        success: true,
      },
    })
  })
})

test('call api error', t => {
  const next = sinon.spy()

  const action = {
    [CALL_API]: {
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint: '/users',
      query: { active: true },
    },
    meta: {
      age: 18,
      success: false,
    },
  }

  return api(store)(next)(action).then(() => {
    t.true(next.calledTwice)

    t.deepEqual(next.firstCall.args[0], {
      type: 'FETCH_REQUEST',
      payload: {
        method: 'get',
        endpoint: '/users',
        query: { active: true },
      },
      meta: {
        age: 18,
        success: false,
      },
    })

    t.deepEqual(next.secondCall.args[0], {
      type: 'FETCH_ERROR',
      payload: 'i am a error',
      error: true,
      meta: {
        age: 18,
        success: false,
      },
    })
  })
})

test('endpoint can be a function', t => {
  const next = () => {}
  const fetch = sinon.stub().returns(new Promise(resolve => setTimeout(() => {
    resolve({ payload: 'foo' })
  })))
  const endpoint = sinon.stub().returns('/users')
  api = createApi(fetch)

  const action = {
    [CALL_API]: {
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint,
    },
  }

  return api(store)(next)(action).then(() => {
    t.true(endpoint.calledOnce)

    t.deepEqual(fetch.firstCall.args[0], {
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint: '/users',
    })
  })
})
