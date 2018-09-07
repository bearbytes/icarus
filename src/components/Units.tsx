import * as React from 'react'
import { withClientState } from './hoc/withClientState'
import UnitTypes from '../resources/UnitTypes'
import { HexCoord } from '../types'

export default function Units() {
  return withClientState(
    s => ({ unitIds: Object.keys(s.game.units) }),
    s => (
      <g pointerEvents={'none'}>
        {s.unitIds.map(unitId => (
          <Unit key={unitId} unitId={unitId} />
        ))}
      </g>
    ),
  )
}

function Unit(props: { unitId: string }) {
  const { unitId } = props
  return withClientState(
    s => {
      const unit = s.game.units[unitId]
      const player = s.game.players[unit.playerId]
      const isSelected = s.ui.selectedUnitId == unitId
      const color = player.color
      const pos = HexCoord.fromId(unit.tileId).toPixel()
      return { unit, color, isSelected, pos }
    },
    s => (
      <g transform={`translate(${s.pos.x}, ${s.pos.y})`}>
        <path
          transform={'scale(0.0025) translate(-256 -256)'}
          d={UnitTypes[s.unit.unitTypeId].svgPath}
          fill={s.isSelected ? 'white' : 'black'}
          stroke={s.color}
          strokeWidth={10}
        />
        <g transform={'translate(0 0.65)'}>
          <path
            transform={'translate(-0.15 0) scale(0.0007) translate(-256 -256)'}
            d={HeartPath}
            fill={s.isSelected ? 'white' : 'black'}
            stroke={'none'}
          />
          <text
            transform={'translate(0.05 0.13) scale(0.025)'}
            fill={s.isSelected ? 'white' : 'black'}
          >
            {s.unit.hitPoints}
          </text>
        </g>
        <g>
          <rect
            x={-0.5}
            y={-0.5}
            width={1}
            height={1}
            fill={'red'}
            stroke={'none'}
          />
        </g>
      </g>
    ),
  )
}

const HeartPath =
  'M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z'
