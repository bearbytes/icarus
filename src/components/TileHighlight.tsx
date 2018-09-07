import React from 'react'
import { HexCoord } from '../types'
import { withClientState } from './hoc/withClientState'

export default function TileHighlight(props: { tileId: string }) {
  const { tileId } = props
  const pos = HexCoord.fromId(tileId).toPixel()

  return withClientState(
    s => ({
      highlight: s.ui.tileHighlights[props.tileId],
    }),
    s => {
      if (!s.highlight) return null
      return (
        <use
          transform={`translate(${pos.x}, ${pos.y})`}
          xlinkHref={'#hexagon'}
          fill={'none'}
          stroke={s.highlight.borderColor}
        />
      )
    },
  )
}
