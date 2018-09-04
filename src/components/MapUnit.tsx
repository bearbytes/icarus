import * as React from 'react'
import { withGameState } from './hoc/withGameState'
import UnitTypes from '../resources/UnitTypes'

interface MapUnitProps {
  unitId: string
}

export default function MapUnit(props: MapUnitProps) {
  const { unitId } = props
  return withGameState(
    s => ({
      unit: s.units[unitId],
      isSelected: s.players[s.localPlayerId].selectedUnitId == unitId,
    }),
    s => (
      <g pointerEvents={'none'}>
        <image
          xlinkHref={UnitTypes[s.unit.unitTypeId].icon}
          x={-50}
          y={-50}
          width={100}
          height={100}
          filter={s.isSelected ? 'invert(100%)' : undefined}
        />
      </g>
    ),
  )
}
