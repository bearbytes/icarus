import React from 'react'
import HexagonMap from './HexagonMap'
import ControlPanel from './ControlPanel'
import { ClientContextProvider } from '../contexts/ClientContext'
import styled from 'styled-components'
import { VBox } from './layout'
import { withDispatch } from './hoc/withClientState'

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
          {withDispatch(dispatch => (
            <HexagonMap
              viewerProps={{
                initialViewRect: {
                  topLeft: { x: -12.5, y: -12.5 },
                  size: { w: 25, h: 25 },
                },
                minViewSize: { w: 20, h: 20 },
                maxViewSize: { w: 30, h: 30 },
                scrollSpeed: 0.01,
                scrollBorderSize: 50,
                onRightClick: () => dispatch({ type: 'RightClick' }),
              }}
            />
          ))}
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
