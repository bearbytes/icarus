import React from 'react'
import HexagonMap from './HexagonMap'
import ControlPanel from './ControlPanel'
import { ClientContextProvider } from '../contexts/ClientContext'
import styled from 'styled-components'
import { VBox } from './layout'

export default function ClientView(props: {
  playerName: string
  playerColor: string
}) {
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
              scrollSpeed: 1,
              scrollBorderSize: 50,
            }}
          />
        </HexMapContainer>
        <ControlPanel />
      </VBox>
    </ClientContextProvider>
  )
}

const HexMapContainer = styled.div`
  width: 50vw;
  height: 50vw;
  margin: auto;
`
