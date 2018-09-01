import { IGameState, IUnit, IHexagonMapTile } from '../types'

export function addUnit(s: IGameState, unit: IUnit) {
  let units = s.units
  units = { ...units, [unit.unitId]: unit }
  return { ...s, units }
}

export function updateTile(
  s: IGameState,
  tileId: string,
  partial: Partial<IHexagonMapTile>,
): IGameState {
  let map = s.map
  let tiles = map.tiles
  let tile = { ...tiles[tileId], ...partial }
  tiles = { ...tiles, [tileId]: tile }
  map = { ...map, tiles }
  return { ...s, map }
}
