import * as React from 'react'

export function pure<P>(props: P, render: (props: P) => React.ReactNode) {
  return <PureWrapper props={props} render={render} />
}

class PureWrapper<P> extends React.PureComponent<{
  props: P
  render: (props: P) => React.ReactNode
}> {
  render() {
    return this.props.render(this.props.props)
  }
}
