import * as React from 'react'

interface StateWrapperProps<S> {
  defaultState: S
  children: (
    state: S,
    setState: <K extends keyof S>(
      state: Pick<S, K> | S | null | ((prevState: S) => Pick<S, K> | S | null),
    ) => void,
  ) => React.ReactNode
}

export default class StateWrapper<T> extends React.Component<
  StateWrapperProps<T>,
  T
> {
  state = this.props.defaultState

  render() {
    return this.props.children(this.state, newState => this.setState(newState))
  }
}
