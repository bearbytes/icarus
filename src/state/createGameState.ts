import { IHexagonMap, HexCoord, IHexagonMapTile, IGameState } from '../types'
import { zipObj } from 'ramda'
import * as Color from 'color'

export function createGameState(): IGameState {
  const map = createHexagonMap()
  const units = {}
  return { map, units, selectedUnitId: null }
}

export function createHexagonMap(): IHexagonMap {
  const radius = 15
  const coordinates = new HexCoord(0, 0).area(radius)
  const tiles = zipObj(
    coordinates.map(c => c.id),
    coordinates.map(c => createHexagonMapTile(c, radius)),
  )
  return { tiles }
}

export function createHexagonMapTile(
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
