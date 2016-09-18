export default function composeReducers(reducers) {
  return (state, action) => {
    if (reducers.length === 0) {
      return state
    }

    const last = reducers[reducers.length - 1]
    const rest = reducers.slice(0, -1)

    return rest.reduceRight((enhanced, reducer) => reducer(enhanced, action), last(state, action))
  }
}
