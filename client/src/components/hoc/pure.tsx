import * as React from 'react'

export function pure<P>(props: P, render: (props: P) => React.ReactNode) {
  return <PureWrapper props={props} render={render} />
}

interface WrapperProps<P> {
  props: P
  render: (props: P) => React.ReactNode
}

class PureWrapper<P> extends React.Component<WrapperProps<P>> {
  render() {
    return this.props.render(this.props.props)
  }

  shouldComponentUpdate(nextProps: WrapperProps<P>) {
    for (const key in this.props.props) {
      const value = this.props.props[key]
      const nextValue = nextProps.props[key]
      if (value !== nextValue) return true
    }
    return false
  }
}
