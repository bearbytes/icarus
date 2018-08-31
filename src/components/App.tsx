import * as React from 'react'
import HexagonMap from './HexagonMap'
import { IHexagonMap, IHexagonMapTile, HexCoord } from '../types'
import { zipObj } from 'ramda'
import styled from 'styled-components'
import * as Color from 'color'

export default function App() {
  const hexagonMap = createHexagonMap()
  return (
    <Container>
      <HexagonMap
        map={hexagonMap}
        tileSize={100}
        viewerProps={{
          initialViewRect: {
            topLeft: { x: -1750, y: -1750 },
            size: { w: 3500, h: 3500 },
          },
          minViewSize: { w: 2000, h: 2000 },
          maxViewSize: { w: 5000, h: 5000 },
        }}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100vmin;
  height: 100vmin;
  margin: auto;
  background-color: gray;
`

function createHexagonMap(): IHexagonMap {
  const radius = 25
  const coordinates = new HexCoord(0, 0).area(radius)
  const tiles = zipObj(
    coordinates.map(c => c.id),
    coordinates.map(c => createHexagonMapTile(c, radius)),
  )
  return { tiles }
}

function createHexagonMapTile(
  coord: HexCoord,
  radius: number,
): IHexagonMapTile {
  const r = ((coord.a / radius + 1) / 2) * 255
  const g = ((coord.b / radius + 1) / 2) * 255
  const b = ((coord.c / radius + 1) / 2) * 255

  return {
    id: coord.id,
    coord,
    color: Color({ r, g, b }).toString(),
  }
}
