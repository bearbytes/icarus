import { createId } from '../lib/createId'
import {
  addUnit,
  updateTile,
  updateUnit,
  canSpawnUnit,
  canMoveUnit,
} from '../state/GameStateHelpers'
import { PlayerAction } from '../actions/PlayerActions'
import { IGameState, IUnit } from '../models'
import { GameEvent } from '../actions/GameEvents'
import { findIndex, tail, last } from 'ramda'
import UnitTypes from '../resources/UnitTypes'

interface IGameStateAndEvents {
  nextState: IGameState
  events: { [playerId: string]: GameEvent[] }
}

export function GameStateReducer(
  s: IGameState,
  a: PlayerAction,
  executingPlayerId: string,
): IGameStateAndEvents {
  if (executingPlayerId != s.activePlayerId) {
    throw Error('Player is not allowed to act')
  }

  switch (a.type) {
    case 'EndTurn':
      return endTurn(s)
    case 'SpawnUnit':
      return spawnUnit(s, a.unitTypeId, a.tileId, executingPlayerId)
    case 'MoveUnit':
      return moveUnit(s, a.unitId, a.path)
  }
}

function sendToAllPlayers(
  s: IGameState,
  ...events: GameEvent[]
): { [playerId: string]: GameEvent[] } {
  const result = {}
  for (const playerId of Object.keys(s.players)) {
    result[playerId] = events
  }
  return result
}

function endTurn(s: IGameState): IGameStateAndEvents {
  const playerIds = Object.keys(s.players)
  let index = 0
  for (const playerId of playerIds) {
    if (playerId == s.activePlayerId) break
    index++
  }
  index = (index + 1) % playerIds.length
  const activePlayerId = playerIds[index]
  s = { ...s, activePlayerId }
  return {
    nextState: s,
    events: sendToAllPlayers(s, {
      type: 'TurnStarted',
      activePlayerId,
    }),
  }
}

function spawnUnit(
  s: IGameState,
  unitTypeId: string,
  tileId: string,
  playerId: string,
): IGameStateAndEvents {
  if (!canSpawnUnit(s, tileId)) {
    throw Error('Tried to spawn unit where none can be spawned')
  }

  const unitId = createId('unit')
  const unit: IUnit = {
    unitId,
    playerId,
    unitTypeId,
    tileId: tileId,
    actionPoints: 2,
    movePoints: UnitTypes[unitTypeId].movePoints,
  }
  s = addUnit(s, unit)
  s = updateTile(s, tileId, { unitId })

  return {
    nextState: s,
    events: sendToAllPlayers(s, {
      type: 'UnitSpawned',
      unit,
    }),
  }
}

function moveUnit(
  s: IGameState,
  unitId: string,
  path: string[],
): IGameStateAndEvents {
  if (!canMoveUnit(s, unitId, path)) {
    throw Error('Tried to move unit where it can not')
  }

  const unit = s.units[unitId]
  const targetTileId = last(path)!

  const remainingMovePoints = unit.movePoints - path.length
  const remainingActionPoints = unit.actionPoints - 1

  s = updateTile(s, unit.tileId, { unitId: undefined })
  s = updateTile(s, targetTileId, { unitId })
  s = updateUnit(s, unitId, {
    tileId: targetTileId,
    movePoints: remainingMovePoints,
    actionPoints: remainingActionPoints,
  })

  return {
    nextState: s,
    events: sendToAllPlayers(s, {
      type: 'UnitMoved',
      unitId,
      path,
      remainingMovePoints,
      remainingActionPoints,
    }),
  }
}
