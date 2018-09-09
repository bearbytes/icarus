import React from 'react'
import HexagonMap from './map/HexagonMap'
import { ClientContextProvider } from '../contexts/ClientContext'
import styled from 'styled-components'
import { withDispatch, withClientState } from './hoc/withClientState'
import { withDebugContext } from '../contexts/DebugContext'
import { HBox, Spacer, VBox } from './layout'
import UnitSpawnSelectionArea from './UnitSpawnSelectionArea'
import EndTurnButton from './EndTurnButton'

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
            return (
              <ClientViewContainer
                playerColor={playerColor}
                isDisabled={!s.isActive}
              />
            )
          },
        )
      })}
    </ClientContextProvider>
  )
}

function ClientViewContainer(props: {
  playerColor: string
  isDisabled: boolean
}) {
  return (
    <StyledClientViewContainer
      borderColor={props.playerColor}
      isDisabled={props.isDisabled}
    >
      <VBox>
        <UnitSpawnSelectionArea />
        <Spacer />
      </VBox>
      <HexMap />
      <VBox>
        <Spacer />
        <EndTurnButton />
      </VBox>
    </StyledClientViewContainer>
  )
}

function HexMap() {
  return (
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
  )
}

const StyledClientViewContainer = styled(HBox)<{
  borderColor: string
  isDisabled: boolean
}>`
  flex: 1;
  border: 5px solid ${p => p.borderColor};
  ${p => (p.isDisabled ? 'filter: blur(2px) grayscale(75%)' : '')};
`

const HexMapContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 80vmin;
  max-height: 80vmin;
  margin: auto;
`
