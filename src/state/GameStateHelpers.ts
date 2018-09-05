import {
  IUnit,
  IHexagonMapTile,
  IPlayer,
  IUnitType,
  IGameState,
} from '../models'
import UnitTypes from '../resources/UnitTypes'
import { HexCoord } from '../lib/HexCoord'
import aStar from 'a-star'
import { contains } from 'ramda'

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

export function getCoordinateOfTile(s: IGameState, tileId: string): HexCoord {
  return s.map.tiles[tileId].coord
}

export function getTileOfUnit(s: IGameState, unitId: string): IHexagonMapTile {
  const unit = s.units[unitId]
  return s.map.tiles[unit.tileId]
}

export function getTypeOfUnit(s: IGameState, unitId: string): IUnitType {
  const unit = s.units[unitId]
  return UnitTypes[unit.unitTypeId]
}

export function canSpawnUnit(s: IGameState, tileId: string): boolean {
  const tile = s.map.tiles[tileId]
  return !tile.blocked
}

export function canMoveUnit(
  s: IGameState,
  unitId: string,
  tileId: string,
): boolean {
  const startTile = getTileOfUnit(s, unitId)
  const path = getPathToTarget(s, startTile.tileId, tileId)
  if (!path) return false
  return true
}

export function getPathToTarget(
  s: IGameState,
  startTileId: string,
  targetTileId: string,
): IHexagonMapTile[] | null {
  const targetCoord = getCoordinateOfTile(s, targetTileId)

  const result = aStar<IHexagonMapTile>({
    start: s.map.tiles[startTileId],
    isEnd: tile => tile.tileId === targetTileId,
    neighbor: tile => getNeighborTiles(s, tile),
    distance: (from, to) => (to.blocked ? 1000000 : 1),
    heuristic: node => node.coord.distance(targetCoord),
    hash: tile => tile.tileId,
  })

  if (result.status !== 'success') {
    return null
  }

  return result.path
}

export function getNeighborTiles(
  s: IGameState,
  tile: IHexagonMapTile,
): IHexagonMapTile[] {
  const result: IHexagonMapTile[] = []
  const neighborIds = tile.coord.neighbors().map(c => c.id)
  for (const id of neighborIds) {
    const neighbor = s.map.tiles[id]
    if (neighbor) {
      result.push(neighbor)
    }
  }
  return result
}

export function getValidMovementTargets(
  s: IGameState,
  unitId: string,
): IHexagonMapTile[] {
  const unitTile = getTileOfUnit(s, unitId)
  const movePoints = getTypeOfUnit(s, unitId).movePoints

  let targets: IHexagonMapTile[] = []
  let workTiles = [unitTile]
  let nextTiles = []

  while (workTiles.length > 0) {
    for (const workTile of workTiles) {
      for (const neighbor of getNeighborTiles(s, workTile)) {
        if (neighbor.blocked) continue
        if (neighbor.coord.distance(unitTile.coord) > movePoints) continue
        if (contains(neighbor, targets)) continue
        if (contains(neighbor, nextTiles)) continue
        nextTiles.push(neighbor)
      }
    }
    targets = [...targets, ...workTiles]
    workTiles = nextTiles
    nextTiles = []
  }

  return targets
}
