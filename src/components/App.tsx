import * as React from 'react'
import HexagonMap from './HexagonMap'
import styled from 'styled-components'
import { ClientContextProvider } from '../contexts/ClientContext'
import ControlPanel from './ControlPanel'
import { ServerContextProvider } from '../contexts/ServerContext'

export default function App() {
  return (
    <ServerContextProvider>
      <HBox>
        <ClientView playerName="Mond" playerColor="blue" />
        <ClientView playerName="Stern" playerColor="red" />
      </HBox>
    </ServerContextProvider>
  )
}

function ClientView(props: { playerName: string; playerColor: string }) {
  return (
    <ClientContextProvider
      playerName={props.playerName}
      playerColor={props.playerColor}
    >
      <VBox>
        <HexMapContainer>
          <HexagonMap
            tileSize={100}
            viewerProps={{
              initialViewRect: {
                topLeft: { x: -1250, y: -1250 },
                size: { w: 2500, h: 2500 },
              },
              minViewSize: { w: 2000, h: 2000 },
              maxViewSize: { w: 3000, h: 3000 },
            }}
          />
        </HexMapContainer>
        <ControlPanel />
      </VBox>
    </ClientContextProvider>
  )
}

const HBox = styled.div`
  display: flex;
`

const VBox = styled.div`
  display: flex;
  flex-direction: column;
`

const HexMapContainer = styled.div`
  width: 50vw;
  height: 80vh;
  margin: auto;
`
