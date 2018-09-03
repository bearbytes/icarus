import * as React from 'react'
import HexagonMap from './HexagonMap'
import styled from 'styled-components'
import { GameContextProvider } from '../contexts/GameContext'
import SideBar from './SideBar'

export default function App() {
  return (
    <GameContextProvider>
      <Container>
        <SideBar />
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
      </Container>
    </GameContextProvider>
  )
}

const Container = styled.div`
  display: flex;
`

const HexMapContainer = styled.div`
  width: 100vmin;
  height: 100vmin;
  margin: auto;
`
