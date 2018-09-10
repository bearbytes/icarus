import React, { ErrorInfo } from 'react'
import { clearState } from '../../lib/persistState'

interface Props {}
interface State {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }
    return (
      <div>
        <h1>Something went wrong.</h1>
        <button onClick={clearCacheAndReload}>Reload</button>
      </div>
    )
  }
}

export function clearCacheAndReload() {
  clearState('game')
  clearState('mond')
  clearState('stern')
  location.reload()
}
