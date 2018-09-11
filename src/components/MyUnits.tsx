import React from 'react'
import { VBox } from './layout'
import { withClientStateAndDispatch } from './hoc/withClientState'
import { getMyUnits, getSelectedUnit } from '../state/ClientStateHelpers'
import { IUnit } from '../models'
import { Unit } from './map/Units'
import styled from 'styled-components'
import { hexCoordOf } from '../state/GameStateHelpers'
import Tile from './map/Tile'
import CenterOnTile from './helper/CenterOnTile'
import withEventListeners from './hoc/withEventListeners'

export default function MyUnits() {
  return withClientStateAndDispatch(
    s => ({
      units: getMyUnits(s),
      selectedUnit: getSelectedUnit(s),
    }),
    s => (
      <VBox>
        {s.units.map((unit, index) => (
          <MyUnit
            key={unit.unitId}
            unit={unit}
            hotkey={'F' + (index + 1)}
            isSelected={unit == s.selectedUnit}
            onClick={() =>
              s.dispatch({
                type: 'ClickOnTile',
                tileId: unit.tileId,
              })
            }
          />
        ))}
      </VBox>
    ),
  )
}

function MyUnit(props: {
  unit: IUnit
  isSelected: boolean
  hotkey: string
  onClick: () => void
}) {
  const { x, y } = hexCoordOf(props.unit.tileId).toPixel()
  return withEventListeners(
    {
      keydown: (e: KeyboardEvent) => {
        if (e.key != props.hotkey) return
        e.stopPropagation()
        e.preventDefault()
        props.onClick()
      },
    },
    () => (
      <StyledMyUnit>
        <svg viewBox={`${x - 1.5} ${y - 1} 2.5 2`}>
          <Tile
            tileId={props.unit.tileId}
            fillColor={props.isSelected ? '#fff' : '#888'}
            strokeColor={'transparent'}
            onClick={props.onClick}
          />
          <g pointerEvents={'none'}>
            <Unit unitId={props.unit.unitId} static={true} />
          </g>
          <CenterOnTile tileId={props.unit.tileId}>
            <text
              transform={'scale(0.04)'}
              x={-35}
              y={17}
              fill={'white'}
              stroke={'black'}
              strokeWidth={0.5}
              textAnchor={'right'}
            >
              {props.hotkey}
            </text>
          </CenterOnTile>
        </svg>
      </StyledMyUnit>
    ),
  )
}

const StyledMyUnit = styled.div`
  width: 100px;
  height: 60px;
`
