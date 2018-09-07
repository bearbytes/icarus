import * as React from 'react'
import { withClientStateAndDispatch } from './hoc/withClientState'
import { HexCoord } from '../types'
import { formatPoints } from '../lib/svg'
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
        fill={s.tile.color}
        stroke={s.highlight ? s.highlight.borderColor : s.tile.color}
        strokeWidth={0.05}
        onMouseEnter={() => s.dispatch({ type: 'HoverTile', tileId })}
        onClick={() => s.dispatch({ type: 'ClickOnTile', tileId })}
      />
    ),
  )
}

const StyledPolygon = styled.polygon`
  :hover {
    filter: brightness(150%);
  }
`
