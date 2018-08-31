import * as React from 'react'
import { formatPoints } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { IHexagonMap, HexCoord } from '../types'
import SvgViewer, { SvgViewerProps } from './SvgViewer'

interface HexagonMapProps {
  map: IHexagonMap
  tileSize: number
  viewerProps: SvgViewerProps
}

export default function HexagonMap(props: HexagonMapProps) {
  const { map, tileSize, viewerProps } = props

  return (
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
  )
}
