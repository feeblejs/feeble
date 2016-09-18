import superagent from 'superagent'
import { normalize } from 'normalizr'

function formatUrl(endpoint) {
  const api = 'https://peaceful-shore-58208.herokuapp.com'
  // const api = 'http://0.0.0.0:9292'
  return [api, endpoint].join('/')
}

export default function callApi({ method, endpoint, query, body, schema }) {
  return new Promise((resolve, reject) => {
    const request = superagent[method](formatUrl(endpoint))

    if (query) { request.query(query) }

    if (body) { request.send(body) }

    request.end((error, res) => {
      if (error) {
        return reject({
          payload: res.body || error,
          error: true,
          meta: { status: res.status, headers: res.headers },
        })
      }
      return resolve({ payload: normalize(res.body, schema) })
    })
  })
}
