import * as React from 'react'
import { withState } from './hoc/withState'
import { withDispatch } from './hoc/withGameState'
import MapUnit from './MapUnit'
import { IHexagonMapTile } from '../models'

interface HexagonMapTileProps {
  tile: IHexagonMapTile
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tile, tileSize } = props
  const pos = tile.coord.toPixel(tileSize)

  return withDispatch(dispatch =>
    withState({ hovered: false }, (state, setState) => (
      <g id={tile.id} transform={`translate(${pos.x}, ${pos.y})`}>
        <use
          xlinkHref={'#hexagon'}
          fill={tile.color}
          stroke={state.hovered ? 'white' : 'black'}
          onMouseEnter={() => setState({ hovered: true })}
          onMouseLeave={() => setState({ hovered: false })}
          onClick={() =>
            dispatch({
              type: 'ClickOnTile',
              tileId: tile.id,
            })
          }
        />
        {tile.unitId && <MapUnit unitId={tile.unitId} />}
      </g>
    )),
  )
}
