import * as React from 'react'
import { HexCoord, IHexagonMap, IHexagonMapTile } from '../types'
import { formatPoints } from '../lib/svg'

export default function HexagonMap(props: { map: IHexagonMap }) {
  return (
    <svg viewBox={'-800 -800 1600 1600'}>
      <defs>
        <polygon
          id={'hexagon'}
          points={formatPoints(HexCoord.corners(95))}
          strokeWidth={5}
        />
      </defs>
      {Object.keys(props.map.tiles).map(id => (
        <HexagonMapTile key={id} tile={props.map.tiles[id]} />
      ))}
    </svg>
  )
}

function HexagonMapTile(props: { tile: IHexagonMapTile }) {
  const pos = props.tile.coord.toPixel(100)

  return (
    <g id={props.tile.id} transform={`translate(${pos.x}, ${pos.y})`}>
      <use xlinkHref={'#hexagon'} />
    </g>
  )
}
