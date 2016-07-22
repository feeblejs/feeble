import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

export default function createHistory(store) {
  return syncHistoryWithStore(browserHistory, store)
}
