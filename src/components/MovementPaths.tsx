import React from 'react'
import { withClientState } from './hoc/withClientState'
import { getSelectedUnit } from '../state/ClientStateHelpers'
import { HexCoord } from '../types'

export default function MovementPaths() {
  return <MovementPath />
}

function MovementPath() {
  return withClientState(
    s => {
      const unit = getSelectedUnit(s)
      return {
        path: s.ui.movementPathTileIds,
        targetTileId: unit && unit.tileId,
      }
    },
    s => {
      if (!s.targetTileId) return null
      const path = [s.targetTileId, ...s.path]

      let polyline = ''
      for (const tileId of path) {
        const coord = HexCoord.fromId(tileId)
        const pixel = coord.toPixel()
        polyline += pixel.x + ',' + pixel.y + ' '
      }

      return (
        <polyline
          points={polyline}
          stroke="#fff3"
          strokeWidth={0.5}
          fill="none"
        />
      )
    },
  )
}
