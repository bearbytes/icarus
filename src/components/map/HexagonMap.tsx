import * as React from 'react'
import { formatPoints } from '../../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { HexCoord } from '../../types'
import SvgViewer, { SvgViewerProps } from './SvgViewer'
import { withClientState } from '../hoc/withClientState'
import { IHexagonMap } from '../../models'
import Units from './Units'
import MovementPaths from './MovementPaths'
import Animations from './Animations'
import Wall from './Wall'

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
    return (
      <SvgViewer {...viewerProps}>
        <defs>
          <polygon
            id={'hexagon'}
            points={formatPoints(HexCoord.corners(0.975))}
            strokeWidth={0.05}
          />
        </defs>
        {Object.keys(map.tiles).map(tileId => (
          <HexagonMapTile key={tileId} tileId={tileId} />
        ))}
        {map.walls.map((wall, index) => (
          <Wall key={index} wall={wall} />
        ))}
        <MovementPaths />
        <Units />
        <Animations />
      </SvgViewer>
    )
  }

  shouldComponentUpdate(nextProps: WrapperProps) {
    return this.props.viewerProps != nextProps.viewerProps
  }
}
