import React from 'react'
import { withState } from '../components/hoc/withState'

export type VisibleClientViewSetting = 'active' | 'inactive' | 'both'

interface IDebugContext {
  visibleClientView: VisibleClientViewSetting
  setVisibleClientView(setting: VisibleClientViewSetting): void
}

const DebugContext = React.createContext<IDebugContext>(null as any)

export default function DebugContextProvider(props: {
  children: React.ReactNode
}) {
  return withState(
    { visibleClientView: 'active' as VisibleClientViewSetting },
    (state, setState) => (
      <DebugContext.Provider
        value={{
          visibleClientView: state.visibleClientView,
          setVisibleClientView: visibleClientView =>
            setState({ visibleClientView }),
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
