import * as React from 'react'
import { withState } from './hoc/withState'
import { withDispatch, withGameState } from './hoc/withGameState'
import MapUnit from './MapUnit'

interface HexagonMapTileProps {
  tileId: string
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tileId, tileSize } = props

  return withDispatch(dispatch =>
    withGameState(
      s => s.map.tiles[tileId],
      tile => {
        const pos = tile.coord.toPixel(tileSize)
        return withState({ hovered: false }, (state, setState) => (
          <g id={tileId} transform={`translate(${pos.x}, ${pos.y})`}>
            <use
              xlinkHref={'#hexagon'}
              fill={tile.color}
              stroke={state.hovered ? 'white' : 'black'}
              onMouseEnter={() => setState({ hovered: true })}
              onMouseLeave={() => setState({ hovered: false })}
              onClick={() =>
                dispatch({
                  type: 'ClickOnTile',
                  tileId: tile.tileId,
                })
              }
            />
            {tile.unitId && <MapUnit unitId={tile.unitId} />}
          </g>
        ))
      },
    ),
  )
}
