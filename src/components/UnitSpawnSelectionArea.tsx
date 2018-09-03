import * as React from 'react'
import styled from 'styled-components'
import { withGameState, withGameStateAndDispatch } from './hoc/withGameState'

export default function UnitSpawnSelectionArea() {
  return (
    <StyledUnitSpawnSelectionArea>
      <UnitSpawnSelection unitTypeId={'todo'} />
    </StyledUnitSpawnSelectionArea>
  )
}

const StyledUnitSpawnSelectionArea = styled.div`
  background-color: gray;
  width: 300px;
  height: 200px;
  padding: 5px;
`

interface UnitSpawnSelectionProps {
  unitTypeId: string
}

function UnitSpawnSelection(props: UnitSpawnSelectionProps) {
  const { unitTypeId } = props

  return withGameStateAndDispatch(
    s => ({
      isSelected:
        s.players[s.activePlayerId].selectedUnitSpawnTypeId === unitTypeId,
    }),
    (s, dispatch) => (
      <StyledUnitSpawnSelection
        showBorder={s.isSelected}
        onClick={() =>
          dispatch({
            type: 'ClickOnUnitSpawnSelection',
            unitTypeId,
          })
        }
      >
        <svg viewBox="-50 -50 100 100">
          <image
            xlinkHref={'https://image.flaticon.com/icons/svg/443/443955.svg'}
            x={-50}
            y={-50}
            width={100}
            height={100}
          />
        </svg>
      </StyledUnitSpawnSelection>
    ),
  )
}

const StyledUnitSpawnSelection = styled.div<{ showBorder: boolean }>`
  width: 50px;
  height: 50px;
  border: ${p => (p.showBorder ? '1px solid white' : '1px solid transparent')};
  :hover {
    border: 1px solid white;
  }
`
