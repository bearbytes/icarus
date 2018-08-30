import * as React from 'react'
import { formatPoints, formatRect } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { IHexagonMap, HexCoord, Rect } from '../types'

interface HexagonMapProps {
  map: IHexagonMap
  tileSize: number
  viewRect: Rect
}

export default function HexagonMap({
  map,
  viewRect,
  tileSize,
}: HexagonMapProps) {
  return (
    <svg viewBox={formatRect(viewRect)}>
      <defs>
        <polygon
          id={'hexagon'}
          points={formatPoints(HexCoord.corners(tileSize * 0.95))}
          strokeWidth={tileSize * 0.05}
        />
      </defs>
      {Object.keys(map.tiles).map(id => (
        <HexagonMapTile key={id} tile={map.tiles[id]} tileSize={tileSize} />
      ))}
    </svg>
  )
}
