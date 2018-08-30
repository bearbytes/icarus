import { HexCoord } from './lib/HexCoord'
export { HexCoord } from './lib/HexCoord'

export interface Point {
  x: number
  y: number
}

export interface Size {
  w: number
  h: number
}

export interface Rect {
  topLeft: Point
  size: Size
}

export interface IHexagonMapTile {
  id: string
  coord: HexCoord
  color: string
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}
