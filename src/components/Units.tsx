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
      <path
        transform={
          `translate(${s.pos.x}, ${s.pos.y})` +
          ' scale(0.0025) translate(-256 -256)'
        }
        d={UnitTypes[s.unit.unitTypeId].svgPath}
        fill={s.isSelected ? 'white' : 'black'}
        stroke={s.color}
        strokeWidth={10}
      />
    ),
  )
}
