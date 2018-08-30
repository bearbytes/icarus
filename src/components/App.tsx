import * as React from 'react'
import HexagonMap from './HexagonMap'
import { IHexagonMap, IHexagonMapTile, HexCoord } from '../types'
import { zipObj } from 'ramda'
import styled from 'styled-components'

export default function App() {
  const hexagonMap = createHexagonMap()
  return (
    <Container>
      <HexagonMap
        map={hexagonMap}
        tileSize={100}
        viewRect={{
          topLeft: { x: -10000, y: -10000 },
          size: { w: 20000, h: 20000 },
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
  const coordinates = new HexCoord(0, 0).area(50)
  const tiles = zipObj(
    coordinates.map(c => c.id),
    coordinates.map(c => createHexagonMapTile(c)),
  )
  return { tiles }
}

function createHexagonMapTile(coord: HexCoord): IHexagonMapTile {
  return {
    id: coord.id,
    coord,
  }
}
