import * as React from 'react'
import { withClientStateAndDispatch } from '../hoc/withClientState'
import { HexCoord } from '../../types'
import { formatPoints } from '../../lib/svg'
import Color from 'color'
import styled from 'styled-components'

export default function HexagonMapTile(props: { tileId: string }) {
  const { tileId } = props

  const pos = HexCoord.fromId(tileId).toPixel()
  const points = formatPoints(
    HexCoord.corners(0.975).map(({ x, y }) => ({
      x: x + pos.x,
      y: y + pos.y,
    })),
  )

  return withClientStateAndDispatch(
    s => ({
      tile: s.game.map.tiles[tileId],
      highlight: s.ui.tileHighlights[tileId],
    }),
    s => (
      <StyledPolygon
        points={points}
        fill={getColor(s.tile.color, s.highlight && s.highlight.highlightColor)}
        stroke={getColor(s.tile.color, s.highlight && s.highlight.borderColor)}
        strokeWidth={0.05}
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

const StyledPolygon = styled.polygon`
  :hover {
    filter: brightness(150%);
  }
`
