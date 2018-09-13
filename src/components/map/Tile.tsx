import React from 'react'
import { HexCoord } from '../../types'
import { formatPoints } from '../../lib/svg'
import styled from 'styled-components'
import CenterOnTile from '../helper/CenterOnTile'

export interface TileProps {
  tileId: string
  fillColor: string
  strokeColor: string
  onMouseEnter?: () => void
  onClick?: () => void
  onSweep?: () => void
}

export default function Tile(props: TileProps) {
  const pos = HexCoord.fromId(props.tileId).toPixel()
  const points = formatPoints(
    HexCoord.corners(0.96).map(({ x, y }) => ({
      x: x + pos.x,
      y: y + pos.y,
    })),
  )

  return (
    // <g>
    <StyledPolygon
      points={points}
      fill={props.fillColor}
      stroke={props.strokeColor}
      strokeWidth={0.08}
      onMouseEnter={props.onMouseEnter}
      onClick={props.onClick}
      onMouseDown={props.onSweep}
      onMouseOver={e => {
        if (!props.onSweep) return
        if (e.buttons != 1) return
        props.onSweep()
      }}
    />
    //   <CenterOnTile tileId={props.tileId}>
    //     <text
    //       x={0}
    //       y={0}
    //       fill={'white'}
    //       transform={'scale(0.03)'}
    //       textAnchor={'middle'}
    //     >
    //       {props.tileId}
    //     </text>
    //   </CenterOnTile>
    // </g>
  )
}

const StyledPolygon = styled.polygon`
  :hover {
    filter: brightness(150%);
  }
`
