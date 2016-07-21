import 'whatwg-fetch'
import config from '../config'

function request(endpont, requestObject) {
  const url = [config.apiUrl, endpont].join('')
  return fetch(url, requestObject)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export default request
