import * as React from 'react'
import { withClientState } from '../hoc/withClientState'
import UnitTypes, { unitTypeOf } from '../../resources/UnitTypes'
import CenterOnTile from '../helper/CenterOnTile'

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

export function Unit(props: { unitId: string; static?: boolean }) {
  const { unitId } = props
  return withClientState(
    s => {
      const unit = s.game.units[unitId]
      const player = s.game.players[unit.playerId]
      const color = player.color
      const isHovered = s.ui.hoveredTileId == unit.tileId
      const isMyUnit = unit.playerId == s.ui.localPlayerId
      return { unit, color, isHovered, isMyUnit }
    },
    s => (
      <CenterOnTile tileId={s.unit.tileId}>
        <path
          transform={'scale(0.0025) translate(-256 -256)'}
          d={UnitTypes[s.unit.unitTypeId].svgPath}
          stroke={s.color}
          strokeWidth={10}
        />
        <HealthBar
          hitPoints={s.unit.hitPoints}
          maxHitPoints={unitTypeOf(s.unit).hitPoints}
          showNumber={s.isHovered && !props.static}
        />
        {s.isMyUnit && (
          <ActionPointIndicator
            actionPoints={s.unit.actionPoints}
            maxActionPoints={2}
          />
        )}
      </CenterOnTile>
    ),
  )
}

function ActionPointIndicator(props: {
  actionPoints: number
  maxActionPoints: number
}) {
  const { actionPoints, maxActionPoints } = props

  const minX = -0.5
  const maxX = +0.5
  const n = maxActionPoints + 1

  const positions = []
  for (let i = 0; i < maxActionPoints; i++) {
    const x = minX + ((i + 1) / n) * (maxX - minX)
    const color = i < actionPoints ? '#ff0c' : '#000c'
    positions.push({ color, x })
  }

  return (
    <g transform={'rotate(-60) translate(0 -0.65)'}>
      {positions.map(({ x, color }) => (
        <circle
          key={x}
          cx={x}
          cy={0}
          r={0.1}
          fill={color}
          stroke={'black'}
          strokeWidth={0.02}
        />
      ))}
    </g>
  )
}

function HealthBar(props: {
  hitPoints: number
  maxHitPoints: number
  showNumber: boolean
}) {
  const { hitPoints, maxHitPoints, showNumber } = props
  return (
    <g transform={'translate(0 0.7)'}>
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
