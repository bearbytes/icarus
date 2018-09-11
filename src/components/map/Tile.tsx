import React from 'react'
import { HexCoord } from '../../types'
import { formatPoints } from '../../lib/svg'
import styled from 'styled-components'

export interface TileProps {
  tileId: string
  fillColor: string
  strokeColor: string
  onMouseEnter?: () => void
  onClick?: () => void
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
    <StyledPolygon
      points={points}
      fill={props.fillColor}
      stroke={props.strokeColor}
      strokeWidth={0.08}
      onMouseEnter={props.onMouseEnter}
      onClick={props.onClick}
    />
  )
}

const StyledPolygon = styled.polygon`
  :hover {
    filter: brightness(150%);
  }
`
