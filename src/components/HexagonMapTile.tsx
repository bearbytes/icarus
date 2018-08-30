import * as React from 'react'
import { IHexagonMapTile } from '../types'

interface HexagonMapTileProps {
  tile: IHexagonMapTile
  tileSize: number
}

export default function HexagonMapTile({
  tile,
  tileSize,
}: HexagonMapTileProps) {
  const pos = tile.coord.toPixel(tileSize)

  return (
    <g id={tile.id} transform={`translate(${pos.x}, ${pos.y})`}>
      <use xlinkHref={'#hexagon'} />
    </g>
  )
}
