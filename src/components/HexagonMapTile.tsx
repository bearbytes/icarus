import * as React from 'react'
import { IHexagonMapTile } from '../types'
import StateWrapper from './StateWrapper'

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
    <StateWrapper defaultState={{ hovered: false }}>
      {(state, setState) => (
        <g id={tile.id} transform={`translate(${pos.x}, ${pos.y})`}>
          <use
            xlinkHref={'#hexagon'}
            fill={tile.color}
            stroke={state.hovered ? 'white' : 'black'}
            onMouseEnter={() => setState({ hovered: true })}
            onMouseLeave={() => setState({ hovered: false })}
          />
        </g>
      )}
    </StateWrapper>
  )
}
