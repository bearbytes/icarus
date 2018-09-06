import * as React from 'react'
import { withState } from './hoc/withState'
import { withClientStateAndDispatch } from './hoc/withClientState'
import MapUnit from './MapUnit'
import { IHexagonMapTileHighlight } from '../models'

interface HexagonMapTileProps {
  tileId: string
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tileId, tileSize } = props

  return withClientStateAndDispatch(
    s => ({
      tile: s.game.map.tiles[tileId],
      highlight: s.ui.tileHighlights[tileId],
    }),
    s => {
      const pos = s.tile.coord.toPixel(tileSize)
      return withState({ hovered: false }, (state, setState) => (
        <g id={tileId} transform={`translate(${pos.x}, ${pos.y})`}>
          <use
            xlinkHref={'#hexagon'}
            fill={s.tile.color}
            stroke={getStrokeColor(state.hovered, s.highlight)}
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

function getStrokeColor(
  hovered: boolean,
  highlight: IHexagonMapTileHighlight | undefined,
) {
  if (hovered) return 'white'
  if (highlight) return highlight.borderColor
  return 'transparent'
}
