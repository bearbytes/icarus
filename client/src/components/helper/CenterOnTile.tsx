import React from 'react'
import { HexCoord } from '../../types'

export default function CenterOnTile(props: {
  tileId: string
  children: React.ReactNode
}) {
  const pos = HexCoord.fromId(props.tileId).toPixel()
  const transform = `translate(${pos.x}, ${pos.y})`
  return <g transform={transform}>{props.children}</g>
}
