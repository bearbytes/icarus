import * as React from 'react'
import { ServerContextProvider } from '../contexts/ServerContext'
import ClientView from './ClientView'
import { HBox, VBox } from './layout'
import DebugPanel from './DebugPanel'
import DebugContextProvider from '../contexts/DebugContext'
import ErrorBoundary from './ErrorBoundary'
import styled from 'styled-components'

export default function App() {
  return (
    <ErrorBoundary>
      <DebugContextProvider>
        <ServerContextProvider>
          <FullScreen>
            <HBox>
              <ClientView playerName="Mond" playerColor="blue" />
              <ClientView playerName="Stern" playerColor="red" />
            </HBox>
            <DebugPanel />
          </FullScreen>
        </ServerContextProvider>
      </DebugContextProvider>
    </ErrorBoundary>
  )
}

const FullScreen = styled(VBox)`
  height: 100vh;
`
