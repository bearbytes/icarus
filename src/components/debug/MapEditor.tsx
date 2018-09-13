import React from 'react'
import SvgViewer from '../map/SvgViewer'
import { HexCoord } from '../../lib/HexCoord'
import Tile from '../map/Tile'

export default function MapEditor() {
  const area = HexCoord.Zero.area(12).map(coord => coord.id)

  return (
    <SvgViewer
      center={{ x: 0, y: 0 }}
      size={40}
      scrollSpeed={0.01}
      zoomFactor={1.2}
      zoomInSteps={4}
      zoomOutSteps={4}
      onRightClick={() => {}}
    >
      {area.map(tileId => (
        <Tile
          key={tileId}
          tileId={tileId}
          fillColor={'white'}
          strokeColor={'black'}
        />
      ))}
    </SvgViewer>
  )
}
