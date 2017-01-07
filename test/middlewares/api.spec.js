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

test('CALL_API not given', () => {
  const next = jest.fn()
  const action = { type: 'INCREMENT' }
  api(store)(next)(action)

  expect(next).toBeCalledWith(action)
})

test('call api success', () => {
  const next = jest.fn()

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
    expect(next.mock.calls[0][0]).toEqual({
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

    expect(next.mock.calls[1][0]).toEqual({
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

test('call api error', () => {
  const next = jest.fn()

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
    expect(next.mock.calls[0][0]).toEqual({
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

    expect(next.mock.calls[1][0]).toEqual({
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

test('endpoint can be a function', () => {
  const next = () => {}
  const fetch = jest.fn().mockReturnValue(new Promise(resolve => setTimeout(() => {
    resolve({ payload: 'foo' })
  })))
  const endpoint = jest.fn().mockReturnValue('/users')
  api = createApi(fetch)

  const action = {
    [CALL_API]: {
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint,
    },
  }

  return api(store)(next)(action).then(() => {
    expect(fetch.mock.calls[0][0]).toEqual({
      types: ['FETCH_REQUEST', 'FETCH_SUCCESS', 'FETCH_ERROR'],
      method: 'get',
      endpoint: '/users',
    })
  })
})
