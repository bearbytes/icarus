import * as React from 'react'
import { withState } from './hoc/withState'
import { withClientStateAndDispatch } from './hoc/withClientState'
import MapUnit from './MapUnit'
import { HexCoord } from '../lib/HexCoord'

interface HexagonMapTileProps {
  tileId: string
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tileId, tileSize } = props

  return withClientStateAndDispatch(
    s => ({
      tile: s.game.map.tiles[tileId],
      isHighlighted: s.ui.highlightedTileIds.find(id => id == tileId) != null,
    }),
    s => {
      const pos = s.tile.coord.toPixel(tileSize)
      return withState({ hovered: false }, (state, setState) => (
        <g id={tileId} transform={`translate(${pos.x}, ${pos.y})`}>
          <use
            xlinkHref={'#hexagon'}
            fill={s.tile.color}
            stroke={
              state.hovered
                ? 'white'
                : s.isHighlighted
                  ? 'lightgray'
                  : 'transparent'
            }
            onMouseEnter={() => setState({ hovered: true })}
            onMouseLeave={() => setState({ hovered: false })}
            onClick={() =>
              s.dispatch({
                type: 'ClickOnTile',
                tileId: s.tile.tileId,
              })
            }
          />
          {s.tile.unitId && <MapUnit unitId={s.tile.unitId} />}
        </g>
      ))
    },
  )
}
