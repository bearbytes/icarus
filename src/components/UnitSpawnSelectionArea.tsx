import * as React from 'react'
import styled from 'styled-components'
import { withGameStateAndDispatch } from './hoc/withGameState'
import UnitTypes from '../resources/UnitTypes'

export default function UnitSpawnSelectionArea() {
  return (
    <StyledUnitSpawnSelectionArea>
      {Object.keys(UnitTypes).map(unitTypeId => (
        <UnitSpawnSelection unitTypeId={unitTypeId} />
      ))}
    </StyledUnitSpawnSelectionArea>
  )
}

const StyledUnitSpawnSelectionArea = styled.div`
  background-color: #111;
  padding: 5px;
  display: flex;
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
    s => (
      <StyledUnitSpawnSelection
        showBorder={s.isSelected}
        onClick={() =>
          s.dispatch({
            type: 'ClickOnUnitSpawnSelection',
            unitTypeId,
          })
        }
      >
        <svg viewBox="0 0 512 512">
          <path d={UnitTypes[unitTypeId].svgPath} fill={'white'} />
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
