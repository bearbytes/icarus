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

interface IGameStateAndEvents {
  nextState: IGameState
  events: { [playerId: string]: GameEvent[] }
}

export function GameStateReducer(
  s: IGameState,
  a: PlayerAction,
  executingPlayerId: string,
): IGameStateAndEvents {
  switch (a.type) {
    case 'SpawnUnit':
      return spawnUnit(s, a.unitTypeId, a.tileId, executingPlayerId)
    case 'MoveUnit':
      return moveUnit(s, a.unitId, a.tileId)
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
  tileId: string,
): IGameStateAndEvents {
  if (!canMoveUnit(s, unitId, tileId)) {
    throw Error('Tried to move unit where it can not')
  }

  const unit = s.units[unitId]
  s = updateTile(s, unit.tileId, { unitId: undefined })
  s = updateTile(s, tileId, { unitId })
  s = updateUnit(s, unitId, { tileId })

  return {
    nextState: s,
    events: sendToAllPlayers(s, {
      type: 'UnitMoved',
      unitId,
      tileId,
    }),
  }
}
