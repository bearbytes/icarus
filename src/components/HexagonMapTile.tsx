import * as React from 'react'
import { IHexagonMapTile } from '../types'
import { withState } from './hoc/withState'
import MapUnit from './MapUnit'
import { withSubmitAction } from './hoc/withGameState'

interface HexagonMapTileProps {
  tile: IHexagonMapTile
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tile, tileSize } = props
  const pos = tile.coord.toPixel(tileSize)

  return withSubmitAction(submitAction =>
    withState({ hovered: false }, (state, setState) => (
      <g id={tile.id} transform={`translate(${pos.x}, ${pos.y})`}>
        <use
          xlinkHref={'#hexagon'}
          fill={tile.color}
          stroke={state.hovered ? 'white' : 'black'}
          onMouseEnter={() => setState({ hovered: true })}
          onMouseLeave={() => setState({ hovered: false })}
          onClick={() =>
            submitAction({
              type: 'ClickOnTile',
              tileId: tile.id,
            })
          }
        />
        {tile.unitId && <MapUnit unit={tile.unitId} />}
      </g>
    )),
  )
}
