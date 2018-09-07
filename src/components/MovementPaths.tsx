import React from 'react'
import { withClientState } from './hoc/withClientState'
import { getSelectedUnit } from '../state/ClientStateHelpers'
import { HexCoord } from '../types'
import { IPathHighlight } from '../models'

export default function MovementPaths() {
  return (
    <g pointerEvents={'none'}>
      <MovementPath />
      <PathHighlights />
    </g>
  )
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
      return PathHighlight({ path, color: '#fff3' })
    },
  )
}

function PathHighlights() {
  return withClientState(
    s => ({
      pathHighlights: s.ui.pathHighlights,
    }),
    s => <g>{s.pathHighlights.map(PathHighlight)}</g>,
  )
}

function PathHighlight(pathHighlight: IPathHighlight) {
  let polyline = ''
  for (const tileId of pathHighlight.path) {
    const coord = HexCoord.fromId(tileId)
    const pixel = coord.toPixel()
    polyline += pixel.x + ',' + pixel.y + ' '
  }

  return (
    <polyline
      points={polyline}
      stroke={pathHighlight.color}
      strokeWidth={0.3}
      // stroke-dasharray="0.3"
      strokeLinecap="round"
      fill="none"
    />
  )
}
