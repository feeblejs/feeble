import { connect as _connect } from 'react-redux'

export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options) {
  let wrappedMapStateToProps = mapStateToProps
  if (mapStateToProps.length === 0) {
    wrappedMapStateToProps = _state => mapStateToProps()
  }
  return _connect(wrappedMapStateToProps, mapDispatchToProps, mergeProps, options)
}
