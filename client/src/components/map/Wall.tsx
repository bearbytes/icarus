import React from 'react'
import { IWall } from '../../models'
import { hexCoordOf } from '../../state/GameStateHelpers'

export default function Wall(props: { wall: IWall }) {
  const leftCoord = hexCoordOf(props.wall.leftTileId)
  const rightCoord = hexCoordOf(props.wall.rightTileId)

  const corners = leftCoord.sharedCorners(rightCoord)
  if (!corners) {
    return null
  }

  const x0 = corners[0].x
  const y0 = corners[0].y
  const x1 = corners[1].x
  const y1 = corners[1].y

  return (
    <polyline
      pointerEvents={'none'}
      stroke={'black'}
      strokeWidth={0.1}
      points={`${x0},${y0} ${x1},${y1}`}
    />
  )
}
