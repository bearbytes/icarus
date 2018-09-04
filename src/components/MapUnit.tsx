import * as React from 'react'
import { withGameState } from './hoc/withGameState'
import UnitTypes from '../resources/UnitTypes'

interface MapUnitProps {
  unitId: string
}

export default function MapUnit(props: MapUnitProps) {
  const { unitId } = props
  return withGameState(
    s => {
      const unit = s.units[unitId]
      const player = s.players[unit.playerId]
      const isSelected = s.players[s.localPlayerId].selectedUnitId == unitId
      const color = player.color
      return { unit, color, isSelected }
    },
    s => (
      <path
        pointerEvents={'none'}
        transform={'scale(0.25) translate(-256 -256)'}
        d={UnitTypes[s.unit.unitTypeId].svgPath}
        fill={s.isSelected ? 'white' : 'black'}
        stroke={s.color}
        strokeWidth={10}
      />
    ),
  )
}
