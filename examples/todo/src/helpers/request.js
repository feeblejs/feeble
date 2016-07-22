import superagent from 'superagent'

function formatUrl(endpoint) {
  const api = 'https://peaceful-shore-58208.herokuapp.com'
  return [api, endpoint].join('/')
}

export default function callApi({ method, endpoint, query, body }) {
  return new Promise((resolve, reject) => {
    const request = superagent[method](formatUrl(endpoint))

    if (query) { request.query(query) }

    if (body) { request.send(body) }

    request.end((error, { body, headers, status }) => {
      if (error) {
        return reject({ payload: body || error, error: true, meta: { status, headers } })
      }
      return resolve({ payload: body })
    })
  })
}
