import React from 'react'
import { withState } from '../components/hoc/withState'

export type Screen =
  | 'active'
  | 'inactive'
  | 'side-by-side'
  | 'unit-editor'
  | 'map-editor'

interface IDebugContext {
  visibleScreen: Screen
  setVisibleScreen(screen: Screen): void
}

const DebugContext = React.createContext<IDebugContext>(null as any)

export default function DebugContextProvider(props: {
  children: React.ReactNode
}) {
  return withState(
    {
      visibleScreen: 'active' as Screen,
    },
    (state, setState) => (
      <DebugContext.Provider
        value={{
          visibleScreen: state.visibleScreen,
          setVisibleScreen: visibleScreen => setState({ visibleScreen }),
        }}
      >
        {props.children}
      </DebugContext.Provider>
    ),
  )
}

export function withDebugContext(
  render: (debugContext: IDebugContext) => React.ReactNode,
) {
  return <DebugContext.Consumer>{render}</DebugContext.Consumer>
}
