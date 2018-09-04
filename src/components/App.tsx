import * as React from 'react'
import HexagonMap from './HexagonMap'
import styled from 'styled-components'
import { GameContextProvider } from '../contexts/GameContext'
import ControlPanel from './ControlPanel'

export default function App() {
  return (
    <HBox>
      <ClientView playerName="Mond" />
      <ClientView playerName="Stern" />
    </HBox>
  )
}

function ClientView(props: { playerName: string }) {
  return (
    <GameContextProvider playerName={props.playerName}>
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
    </GameContextProvider>
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
