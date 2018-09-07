import * as React from 'react'
import { formatPoints } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { HexCoord } from '../types'
import SvgViewer, { SvgViewerProps } from './SvgViewer'
import { withClientState } from './hoc/withClientState'
import { IHexagonMap } from '../models'
import { getSelectedUnitId, getSelectedUnit } from '../state/ClientStateHelpers'
import Units from './Units'
import TileHighlight from './TileHighlight'
import HoverTile from './HoverTile'

interface HexagonMapProps {
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
    const { map, viewerProps } = this.props
    const tileIds = Object.keys(map.tiles)
    return (
      <SvgViewer {...viewerProps}>
        <defs>
          <polygon
            id={'hexagon'}
            points={formatPoints(HexCoord.corners())}
            strokeWidth={0.05}
          />
        </defs>
        {tileIds.map(tileId => (
          <HexagonMapTile key={tileId} tileId={tileId} />
        ))}
        {tileIds.map(tileId => (
          <TileHighlight key={tileId} tileId={tileId} />
        ))}
        <MovementPath />
        <Units />
        <HoverTile />
      </SvgViewer>
    )
  }

  shouldComponentUpdate(nextProps: WrapperProps) {
    return this.props.viewerProps != nextProps.viewerProps
  }
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
          stroke="white"
          strokeWidth={15}
          fill="none"
        />
      )
    },
  )
}
