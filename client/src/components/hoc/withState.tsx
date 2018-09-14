import * as React from 'react'
import { Observable, Subscription } from 'rxjs'
import { fetchState, storeState } from '../../lib/persistState'

type SetState<S> = (
  state: StateUpdate<S> | ((prevState: S) => StateUpdate<S>),
) => void

type StateUpdate<S> = S | Partial<S> | null

export function withState<S extends object>(
  defaultState: S,
  render: (state: S, setState: SetState<S>) => React.ReactNode,
) {
  class StateHolder extends React.Component<{}, S> {
    state = defaultState

    render() {
      return render(
        this.state,
        // Disable Type checking here so we can assign Partial<S> to state
        // This might be a problem due to https://github.com/Microsoft/TypeScript/issues/12793
        newState => this.setState(newState as any),
      )
    }
  }
  return <StateHolder />
}

export function withStickyState<S extends object>(
  persistKey: string,
  defaultState: S,
  render: (state: S, setState: SetState<S>) => React.ReactNode,
) {
  const initialState = fetchState<S>(persistKey) || defaultState
  return withState(initialState, (state, setState) => {
    storeState(persistKey, state)
    return render(state, setState)
  })
}

export function withStateFromObservable<S>(
  observable: Observable<S>,
  render: (state: S) => React.ReactNode,
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
      return render(value)
    }
  }
  return <StateHolder />
}
