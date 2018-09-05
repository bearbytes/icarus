import {
  IClientState,
  IUnit,
  IHexagonMapTile,
  IPlayer,
  IUnitType,
} from '../models'
import UnitTypes from '../resources/UnitTypes'
import { HexCoord } from '../lib/HexCoord'

export function addUnit(s: IClientState, unit: IUnit) {
  let units = s.units
  units = { ...units, [unit.unitId]: unit }
  return { ...s, units }
}

export function updateTile(
  s: IClientState,
  tileId: string,
  partial: Partial<IHexagonMapTile>,
): IClientState {
  let map = s.map
  let tiles = map.tiles
  let tile = { ...tiles[tileId], ...partial }
  tiles = { ...tiles, [tileId]: tile }
  map = { ...map, tiles }
  return { ...s, map }
}

export function updateUnit(
  s: IClientState,
  unitId: string,
  partial: Partial<IUnit>,
): IClientState {
  let units = s.units
  let unit = { ...units[unitId], ...partial }
  units = { ...units, [unitId]: unit }
  return { ...s, units }
}

export function updatePlayer(
  s: IClientState,
  playerId: string,
  partial: Partial<IPlayer>,
): IClientState {
  let players = s.players
  let player = { ...players[playerId], ...partial }
  players = { ...players, [playerId]: player }
  return { ...s, players }
}

export function getUnitOnTile(s: IClientState, tileId: string): IUnit | null {
  const unitId = s.map.tiles[tileId].unitId
  if (!unitId) return null
  return s.units[unitId]
}

export function getCoordinateOfTile(s: IClientState, tileId: string): HexCoord {
  return s.map.tiles[tileId].coord
}

export function getTileOfUnit(
  s: IClientState,
  unitId: string,
): IHexagonMapTile {
  const unit = s.units[unitId]
  return s.map.tiles[unit.tileId]
}

export function getTypeOfUnit(s: IClientState, unitId: string): IUnitType {
  const unit = s.units[unitId]
  return UnitTypes[unit.unitTypeId]
}

export function getSelectedUnitOfPlayer(
  s: IClientState,
  playerId: string,
): IUnit | null {
  if (!s.selectedUnitId) return null
  return s.units[s.selectedUnitId]
}
