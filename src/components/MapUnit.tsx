import * as React from 'react'
import { withClientState } from './hoc/withClientState'
import UnitTypes from '../resources/UnitTypes'

interface MapUnitProps {
  unitId: string
}

export default function MapUnit(props: MapUnitProps) {
  const { unitId } = props
  return withClientState(
    s => {
      const unit = s.game.units[unitId]
      const player = s.game.players[unit.playerId]
      const isSelected = s.ui.selectedUnitId == unitId
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
