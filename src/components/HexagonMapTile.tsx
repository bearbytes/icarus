import * as React from 'react'
import { withClientStateAndDispatch } from './hoc/withClientState'
import { HexCoord } from '../types'

export default function HexagonMapTile(props: { tileId: string }) {
  const { tileId } = props
  const pos = HexCoord.fromId(tileId).toPixel(100)

  return withClientStateAndDispatch(
    s => ({ tile: s.game.map.tiles[tileId] }),
    s => (
      <use
        transform={`translate(${pos.x}, ${pos.y})`}
        xlinkHref={'#hexagon'}
        fill={s.tile.color}
        onMouseEnter={() => s.dispatch({ type: 'HoverTile', tileId })}
        onClick={() => s.dispatch({ type: 'ClickOnTile', tileId })}
      />
    ),
  )
}
