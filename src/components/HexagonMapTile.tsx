import * as React from 'react'
import { IHexagonMapTile, IUnit } from '../types'
import StateWrapper from './StateWrapper'
import MapUnit from './MapUnit'

interface HexagonMapTileProps {
  tile: IHexagonMapTile
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tile, tileSize } = props
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
          {tile.unitId && <MapUnit unit={tile.unitId} />}
        </g>
      )}
    </StateWrapper>
  )
}
