import React from 'react'
import HexagonMap from './map/HexagonMap'
import { ClientContextProvider } from '../contexts/ClientContext'
import styled from 'styled-components'
import { withDispatch, withClientState } from './hoc/withClientState'
import { withDebugContext } from '../contexts/DebugContext'
import { HBox, Spacer, VBox } from './layout'
import UnitSpawnSelectionArea from './UnitSpawnSelectionArea'
import EndTurnButton from './EndTurnButton'
import AttackPreview from './AttackPreview'
import MyUnits from './MyUnits'
import SkillBar from './SkillBar'

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
            visibleScreen: ctx.visibleScreen,
          }),
          s => {
            const visible =
              (s.visibleScreen == 'active' && s.isActive) ||
              (s.visibleScreen == 'inactive' && !s.isActive) ||
              s.visibleScreen == 'side-by-side'

            if (!visible) return null

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
      <ControlBar />
      <MyUnits />
      <HexMap />
    </StyledClientViewContainer>
  )
}

function ControlBar() {
  return (
    <VBox>
      <UnitSpawnSelectionArea />
      <Spacer />
      <AttackPreview />
      <SkillBar />
      <EndTurnButton />
    </VBox>
  )
}

function HexMap() {
  return withDispatch(dispatch => (
    <HexagonMap
      viewerProps={{
        center: { x: 0, y: 0 },
        size: 40,
        scrollSpeed: 0.01,
        zoomFactor: 1.2,
        zoomInSteps: 4,
        zoomOutSteps: 4,
        onRightClick: () => dispatch({ type: 'RightClick' }),
      }}
    />
  ))
}

const StyledClientViewContainer = styled(HBox)<{
  borderColor: string
  isDisabled: boolean
}>`
  flex: 1;
  border: 5px solid ${p => p.borderColor};
  ${p => (p.isDisabled ? 'filter: blur(2px) grayscale(75%)' : '')};
`
