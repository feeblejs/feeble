import { connect as _connect } from 'react-redux'

export default function connect(mapStateToProps: any, mapDispatchToProps: any, mergeProps: any, options: any) {
  let wrappedMapStateToProps = mapStateToProps
  if (mapStateToProps.length === 0) {
    wrappedMapStateToProps = (_state: any) => mapStateToProps()
  }
  return _connect(wrappedMapStateToProps, mapDispatchToProps, mergeProps, options)
}
