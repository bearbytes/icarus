import {
  IUnit,
  IHexagonMapTile,
  IPlayer,
  IUnitType,
  IGameState,
} from '../models'
import UnitTypes, { unitTypeOf } from '../resources/UnitTypes'
import { HexCoord } from '@icarus/hexlib'
import aStar from 'a-star'
import { tail } from 'ramda'

export function addUnit(s: IGameState, unit: IUnit) {
  let units = s.units
  units = { ...units, [unit.unitId]: unit }
  return { ...s, units }
}

export function removeUnit(s: IGameState, unitId: string) {
  const { [unitId]: removedUnit, ...units } = s.units
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
  partialOrUpdater: Partial<IUnit> | ((unit: IUnit) => Partial<IUnit>),
): IGameState {
  let units = s.units
  let unit = units[unitId]

  let partial = partialOrUpdater
  if (typeof partialOrUpdater == 'function') {
    partial = partialOrUpdater(unit)
  }

  unit = { ...unit, ...partial }
  units = { ...units, [unitId]: unit }
  return { ...s, units }
}

export function updateUnits(
  s: IGameState,
  updater: (unit: IUnit) => Partial<IUnit> | null,
) {
  const updates = {}
  for (const unitId of Object.keys(s.units)) {
    const unit = s.units[unitId]
    const update = updater(unit)
    if (!update) continue
    updates[unitId] = { ...unit, ...update }
  }
  return { ...s, units: { ...s.units, ...updates } }
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

export function getUnitOnTile(
  s: IGameState,
  tileId: string | null,
): IUnit | null {
  if (!tileId) return null
  const unitId = s.map.tiles[tileId].unitId
  if (!unitId) return null
  return s.units[unitId]
}

export function hexCoordOf(tile: IHexagonMapTile | string): HexCoord {
  const tileId = typeof tile == 'string' ? tile : tile.tileId
  return HexCoord.fromId(tileId)
}

export function getTileOfUnit(
  s: IGameState,
  unit: IUnit | string,
): IHexagonMapTile {
  unit = asUnit(s, unit)
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
  path: string[],
): boolean {
  const unit = s.units[unitId]
  if (unit.actionPoints == 0) return false
  if (unit.movePoints < path.length) return false

  // TODO test if path is connected and adjacent to unit tile

  return true
}

export function canAttack(
  s: IGameState,
  attackerUnitId: string | null,
  defenderUnitId: string | null,
  attackerPlayerId: string,
): boolean {
  if (!attackerUnitId) return false
  if (!defenderUnitId) return false

  if (s.activePlayerId != attackerPlayerId) return false

  const attackerUnit = s.units[attackerUnitId]
  const attackedUnit = s.units[defenderUnitId]

  if (attackerUnit.playerId != attackerPlayerId) return false
  if (attackedUnit.playerId == attackerPlayerId) return false

  if (attackerUnit.actionPoints == 0) return false

  const attackerTile = s.map.tiles[attackerUnit.tileId]
  const attackedTile = s.map.tiles[attackedUnit.tileId]

  const dist = hexCoordOf(attackerTile).distance(hexCoordOf(attackedTile))
  const range = UnitTypes[attackerUnit.unitTypeId].weapon.rangeMax

  return dist <= range
}

export function getPathToTarget(
  s: IGameState,
  startTileId: string,
  targetTileId: string,
): IHexagonMapTile[] | null {
  const targetCoord = hexCoordOf(targetTileId)

  const result = aStar<IHexagonMapTile>({
    start: s.map.tiles[startTileId],
    isEnd: tile => tile.tileId === targetTileId,
    neighbor: tile => getNeighborTiles(s, tile),
    distance: (from, to) => {
      if (isBlocked(s, from.tileId, to.tileId)) {
        return 1000000
      } else {
        return 1
      }
    },
    heuristic: node => hexCoordOf(node).distance(targetCoord),
    hash: tile => tile.tileId,
  })

  if (result.status !== 'success') {
    return null
  }

  return tail(result.path)
}

export function getNeighborTiles(
  s: IGameState,
  tile: IHexagonMapTile,
): IHexagonMapTile[] {
  const result: IHexagonMapTile[] = []
  const neighborIds = hexCoordOf(tile)
    .neighbors()
    .map(c => c.id)
  for (const id of neighborIds) {
    const neighbor = s.map.tiles[id]
    if (neighbor) {
      result.push(neighbor)
    }
  }
  return result
}

export function isBlocked(s: IGameState, fromTileId: string, toTileId: string) {
  if (s.map.tiles[toTileId].blocked) return true

  const isBlockedByWall = s.map.walls.find(
    wall =>
      (wall.leftTileId == fromTileId && wall.rightTileId == toTileId) ||
      (wall.rightTileId == fromTileId && wall.leftTileId == toTileId),
  )

  return isBlockedByWall
}

export function getReachableTileIds(
  s: IGameState,
  startTileId: string,
  range: number,
): string[] {
  const startTile = s.map.tiles[startTileId]

  let currentTiles = [startTile]

  const tileDistances = {
    [startTileId]: 0,
  }

  while (currentTiles.length) {
    const nextTiles = []
    for (const tile of currentTiles) {
      const dist = tileDistances[tile.tileId]
      for (const neighbor of getNeighborTiles(s, tile)) {
        if (isBlocked(s, tile.tileId, neighbor.tileId)) continue
        const neighborDist = dist + 1
        if (neighborDist > range) continue
        if (
          tileDistances[neighbor.tileId] == null ||
          tileDistances[neighbor.tileId] > neighborDist
        ) {
          tileDistances[neighbor.tileId] = neighborDist
          nextTiles.push(neighbor)
        }
      }
    }
    currentTiles = nextTiles
  }

  return Object.keys(tileDistances)
}

export function getReachableTileIdsForUnit(
  s: IGameState,
  unitId: string,
): string[] {
  const unitTile = getTileOfUnit(s, unitId)
  const movePoints = getTypeOfUnit(s, unitId).movePoints
  return getReachableTileIds(s, unitTile.tileId, movePoints)
}

export function getHitChance(
  s: IGameState,
  attacker: IUnit | string,
  defender: IUnit | string,
): number {
  const targetTileId = getTileOfUnit(s, defender).tileId
  return getHitChanceForTile(s, attacker, targetTileId)
}

export function getHitChanceForTile(
  s: IGameState,
  attacker: IUnit | string,
  targetTileId: string,
) {
  const attackerTile = getTileOfUnit(s, attacker)
  if (isLineBlocked(s, attackerTile.tileId, targetTileId)) return 0

  const attackerCoord = hexCoordOf(attackerTile)
  const defenderCoord = hexCoordOf(targetTileId)
  const dist = attackerCoord.distance(defenderCoord)

  const cutoffDist = unitTypeOf(asUnit(s, attacker)).weapon.rangeCutOff

  let hitChance = 1.0
  for (let d = 0; d < dist; d++) {
    hitChance = hitChance * 0.9
    if (d >= cutoffDist) {
      hitChance = hitChance * 0.9
    }
  }

  return hitChance
}

export function isLineBlocked(
  s: IGameState,
  fromTileId: string,
  toTileId: string,
) {
  const fromCoord = HexCoord.fromId(fromTileId)
  const toCoord = HexCoord.fromId(toTileId)
  const dist = fromCoord.distance(toCoord)

  const fromPixel = fromCoord.toPixel()
  const toPixel = toCoord.toPixel()

  const { x, y } = fromPixel
  const dx = toPixel.x - fromPixel.x
  const dy = toPixel.y - fromPixel.y

  const tileIds = []
  for (let i = 0; i <= dist; i++) {
    const pos = {
      x: x + (dx * i) / dist,
      y: y + (dy * i) / dist,
    }
    const tileId = HexCoord.fromPixel(pos).round().id
    tileIds.push(tileId)
  }

  for (let i = 1; i < tileIds.length; i++) {
    if (isBlocked(s, tileIds[i - 1], tileIds[i])) return true
  }
  return false
}

function asUnit(s: IGameState, unit: IUnit | string): IUnit {
  if (typeof unit == 'object') return unit
  return s.units[unit]
}

function asTile(
  s: IGameState,
  tile: IHexagonMapTile | string,
): IHexagonMapTile {
  if (typeof tile == 'object') return tile
  return s.map.tiles[tile]
}
