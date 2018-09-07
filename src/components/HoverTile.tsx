import React from 'react'
import { withClientState } from './hoc/withClientState'
import { HexCoord } from '../types'

export default function HoverTile() {
  return withClientState(
    s => ({
      hoveredTileId: s.ui.hoveredTileId,
    }),
    s => {
      if (!s.hoveredTileId) return null
      const pos = HexCoord.fromId(s.hoveredTileId).toPixel()
      return (
        <use
          transform={`translate(${pos.x}, ${pos.y})`}
          xlinkHref={'#hexagon'}
          fill={'none'}
          stroke={'white'}
        />
      )
    },
  )
}
