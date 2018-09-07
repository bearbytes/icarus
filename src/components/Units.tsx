import * as React from 'react'
import { withClientState } from './hoc/withClientState'
import UnitTypes, { unitTypeOf } from '../resources/UnitTypes'
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
      const isHovered = s.ui.hoveredTileId == unit.tileId
      return { unit, color, isSelected, pos, isHovered }
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
        <HealthBar
          hitPoints={s.unit.hitPoints}
          maxHitPoints={unitTypeOf(s.unit).hitPoints}
          showNumber={s.isHovered}
        />
      </g>
    ),
  )
}

function HealthBar(props: {
  hitPoints: number
  maxHitPoints: number
  showNumber: boolean
}) {
  const { hitPoints, maxHitPoints, showNumber } = props
  return (
    <g transform={'translate(0 0.8)'}>
      <rect
        x={-0.5}
        y={-0.1}
        width={1}
        height={0.2}
        fill={'red'}
        stroke={'none'}
      />
      <rect
        x={-0.5}
        y={-0.1}
        width={hitPoints / maxHitPoints}
        height={0.2}
        fill={'green'}
        stroke={'none'}
      />
      {showNumber && (
        <text
          transform={'scale(0.03)'}
          x={0}
          y={18}
          textAnchor={'middle'}
          fill={'green'}
          stroke={'black'}
          strokeWidth={0.5}
        >
          {hitPoints} HP
        </text>
      )}
    </g>
  )
}

const HeartPath =
  'M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z'
