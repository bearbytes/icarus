import * as React from 'react'
import { Observable, Subscription } from 'rxjs'

type SetState<S> = (
  state: StateUpdate<S> | ((prevState: S) => StateUpdate<S>),
) => void

type StateUpdate<S> = S | Partial<S> | null

export function withState<S>(
  defaultState: S,
  children: (state: S, setState: SetState<S>) => React.ReactNode,
) {
  class StateHolder<T> extends React.Component<{}, S> {
    state = defaultState

    render() {
      return children(
        this.state,
        // Disable Type checking here so we can assign Partial<S> to state
        // This might be a problem due to https://github.com/Microsoft/TypeScript/issues/12793
        newState => this.setState(newState as any),
      )
    }
  }
  return <StateHolder />
}

export function withStateFromObservable<S>(
  observable: Observable<S>,
  children: (state: S) => React.ReactNode,
) {
  class StateHolder extends React.Component<{}, { value?: S }> {
    state = { value: undefined }
    subscription = null as Subscription | null

    componentDidMount() {
      this.subscription = observable.subscribe(value =>
        this.setState({ value }),
      )
    }
    componentWillUnmount() {
      if (!this.subscription) return
      this.subscription.unsubscribe()
      this.subscription = null
    }

    render() {
      const value = this.state.value
      if (!value) return null
      return children(value)
    }
  }
  return <StateHolder />
}
