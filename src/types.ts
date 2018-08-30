import { HexCoord } from './lib/HexCoord'
export { HexCoord } from './lib/HexCoord'

export interface Point {
  x: number
  y: number
}

export interface IHexagonMapTile {
  id: string
  coord: HexCoord
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}
