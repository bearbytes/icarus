import * as React from 'react'
import { formatPoints } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { HexCoord } from '../types'
import SvgViewer, { SvgViewerProps } from './SvgViewer'
import { withClientState } from './hoc/withClientState'
import { IHexagonMap } from '../models'

interface HexagonMapProps {
  tileSize: number
  viewerProps: SvgViewerProps
}

export default function HexagonMap(props: HexagonMapProps) {
  return withClientState(
    s => s.game.map,
    map => <Wrapper map={map} {...props} />,
  )
}

interface WrapperProps extends HexagonMapProps {
  map: IHexagonMap
}

class Wrapper extends React.Component<WrapperProps> {
  render() {
    const { map, tileSize, viewerProps } = this.props
    return (
      <SvgViewer {...viewerProps}>
        <defs>
          <polygon
            id={'hexagon'}
            points={formatPoints(HexCoord.corners(tileSize * 0.95))}
            strokeWidth={tileSize * 0.05}
          />
        </defs>
        {Object.keys(map.tiles).map(tileId => (
          <HexagonMapTile key={tileId} tileId={tileId} tileSize={tileSize} />
        ))}
        {/* <MovementPath tileSize={tileSize} /> */}
      </SvgViewer>
    )
  }

  shouldComponentUpdate(nextProps: WrapperProps) {
    return (
      this.props.tileSize != nextProps.tileSize ||
      this.props.viewerProps != nextProps.viewerProps
    )
  }
}

function MovementPath(props: { tileSize: number }) {
  return withClientState(
    s => ({
      path: s.ui.movementPathTileIds,
    }),
    s => {
      let polyline = ''
      for (const tileId of s.path) {
        const coord = HexCoord.fromId(tileId)
        const pixel = coord.toPixel(props.tileSize)
        polyline += pixel.x + ',' + pixel.y + ' '
      }

      return <polyline points={polyline} stroke="white" fill="none" />
    },
  )
}
