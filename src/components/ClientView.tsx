import React from 'react'
import HexagonMap from './HexagonMap'
import ControlPanel from './ControlPanel'
import { ClientContextProvider } from '../contexts/ClientContext'
import styled from 'styled-components'
import { withDispatch, withClientState } from './hoc/withClientState'
import { withDebugContext } from '../contexts/DebugContext'

export default function ClientView(props: {
  playerName: string
  playerColor: string
}) {
  const { playerName, playerColor } = props

  return (
    <ClientContextProvider playerName={playerName} playerColor={playerColor}>
      {withDebugContext(ctx => {
        return withClientState(
          s => ({
            isActive: s.game.activePlayerId == s.ui.localPlayerId,
            visibleClientView: ctx.visibleClientView,
          }),
          s => {
            if (s.visibleClientView == 'active' && !s.isActive) return null
            if (s.visibleClientView == 'inactive' && s.isActive) return null
            return <ClientViewContainer playerColor={playerColor} />
          },
        )
      })}
    </ClientContextProvider>
  )
}

function ClientViewContainer(props: { playerColor: string }) {
  return (
    <StyledClientViewContainer borderColor={props.playerColor}>
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
    </StyledClientViewContainer>
  )
}

const StyledClientViewContainer = styled.div<{ borderColor: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 5px solid ${p => p.borderColor};
`

const HexMapContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 80vmin;
  max-height: 80vmin;
  margin: auto;
`
