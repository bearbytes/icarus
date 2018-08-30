import * as React from 'react'
import HexagonMap from './HexagonMap'
import { IHexagonMap, IHexagonMapTile, HexCoord } from '../types'
import { zipObj } from 'ramda'

export default function App() {
  const hexagonMap = createHexagonMap()
  return <HexagonMap map={hexagonMap} />
}

function createHexagonMap(): IHexagonMap {
  const coordinates = new HexCoord(0, 0).area(4)
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
