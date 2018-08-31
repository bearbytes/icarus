import * as React from 'react'
import { IUnit } from '../types'

interface MapUnitProps {
  unit: IUnit
}

export default function MapUnit(props: MapUnitProps) {
  return (
    <g pointerEvents={'none'}>
      <image
        xlinkHref={'https://image.flaticon.com/icons/svg/443/443955.svg'}
        x={-50}
        y={-50}
        width={100}
        height={100}
      />
    </g>
  )
}
