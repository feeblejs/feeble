import 'whatwg-fetch'
import config from '../config'

function request(endpont, requestObject) {
  const url = [config.apiUrl, endpont].join('')
  return fetch(url, requestObject).then(response => response.json())
}

export default request
