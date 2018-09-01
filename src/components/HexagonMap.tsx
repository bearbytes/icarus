import * as React from 'react'
import { formatPoints } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { HexCoord } from '../types'
import SvgViewer, { SvgViewerProps } from './SvgViewer'
import { withGameState } from './hoc/withGameState'

interface HexagonMapProps {
  tileSize: number
  viewerProps: SvgViewerProps
}

export default function HexagonMap(props: HexagonMapProps) {
  const { tileSize, viewerProps } = props

  return withGameState(
    s => s.map,
    map => (
      <SvgViewer {...viewerProps}>
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
      </SvgViewer>
    ),
  )
}
