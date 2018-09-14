import * as React from 'react'
import { withClientStateAndDispatch } from '../hoc/withClientState'
import Color from 'color'
import Tile from './Tile'

export default function HexagonMapTile(props: { tileId: string }) {
  const { tileId } = props

  return withClientStateAndDispatch(
    s => ({
      tile: s.game.map.tiles[tileId],
      highlight: s.ui.tileHighlights[tileId],
    }),
    s => (
      <Tile
        tileId={tileId}
        fillColor={getColor(
          s.tile.color,
          s.highlight && s.highlight.highlightColor,
        )}
        strokeColor={getColor(
          s.tile.color,
          s.highlight && s.highlight.borderColor,
        )}
        onMouseEnter={() => s.dispatch({ type: 'HoverTile', tileId })}
        onClick={() => s.dispatch({ type: 'ClickOnTile', tileId })}
      />
    ),
  )
}

function getColor(color: string, highlightColor?: string): string {
  if (!highlightColor) return color
  const cColor = Color(color)
  const cHighlight = Color(highlightColor)
  return cColor.mix(cHighlight.alpha(1), cHighlight.alpha()).toString()
}
