import * as React from 'react'
import HexagonMap from './HexagonMap'
import styled from 'styled-components'
import { GameContextProvider } from '../contexts/GameContext'

export default function App() {
  return (
    <GameContextProvider>
      <Container>
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
      </Container>
    </GameContextProvider>
  )
}

const Container = styled.div`
  width: 100vmin;
  height: 100vmin;
  margin: auto;
`
