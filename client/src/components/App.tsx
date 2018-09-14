import * as React from 'react'
import { ServerContextProvider } from '../contexts/ServerContext'
import ClientView from './ClientView'
import { VBox, ExpandingHBox, HBox } from './layout'
import DebugPanel from './debug/DebugPanel'
import DebugContextProvider from '../contexts/DebugContext'
import ErrorBoundary from './debug/ErrorBoundary'
import styled from 'styled-components'
import DebugScreen from './debug/DebugScreen'

export default function App() {
  return (
    <ErrorBoundary>
      <DebugContextProvider>
        <ServerContextProvider>
          <FullScreen>
            <ExpandingHBox>
              <DebugScreen />
              <ClientView playerName="Mond" playerColor="blue" />
              <ClientView playerName="Stern" playerColor="red" />
            </ExpandingHBox>
            <DebugPanel />
          </FullScreen>
        </ServerContextProvider>
      </DebugContextProvider>
    </ErrorBoundary>
  )
}

const FullScreen = styled(VBox)`
  height: 100vh;
  max-height: 100vh;
  /* overflow: hidden; */
`
