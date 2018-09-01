import { IGameState, IUnit, IHexagonMapTile, IPlayer } from '../models'

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

export function updateUnit(
  s: IGameState,
  unitId: string,
  partial: Partial<IUnit>,
): IGameState {
  let units = s.units
  let unit = { ...units[unitId], ...partial }
  units = { ...units, [unitId]: unit }
  return { ...s, units }
}

export function updatePlayer(
  s: IGameState,
  playerId: string,
  partial: Partial<IPlayer>,
): IGameState {
  let players = s.players
  let player = { ...players[playerId], ...partial }
  players = { ...players, [playerId]: player }
  return { ...s, players }
}

export function getUnitOnTile(s: IGameState, tileId: string): IUnit | null {
  const unitId = s.map.tiles[tileId].unitId
  if (!unitId) return null
  return s.units[unitId]
}

export function getTileOfUnit(s: IGameState, unitId: string): IHexagonMapTile {
  const unit = s.units[unitId]
  return s.map.tiles[unit.tileId]
}

export function getSelectedUnitOfPlayer(
  s: IGameState,
  playerId: string,
): IUnit | null {
  const unitId = s.players[playerId].selectedUnitId
  if (!unitId) return null
  return s.units[unitId]
}
