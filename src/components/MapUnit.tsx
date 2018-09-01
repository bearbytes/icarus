import * as React from 'react'
import { withGameState } from './hoc/withGameState'

interface MapUnitProps {
  unitId: string
}

export default function MapUnit(props: MapUnitProps) {
  const { unitId } = props
  return withGameState(
    s => s.units[unitId],
    unit => (
      <g pointerEvents={'none'}>
        <image
          xlinkHref={'https://image.flaticon.com/icons/svg/443/443955.svg'}
          x={-50}
          y={-50}
          width={100}
          height={100}
        />
      </g>
    ),
  )
}
