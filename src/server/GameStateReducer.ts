import { createId } from '../lib/createId'
import {
  addUnit,
  updateTile,
  canSpawnUnit,
  canMoveUnit,
  updateUnits,
  canAttack,
  updateUnit,
  removeUnit,
} from '../state/GameStateHelpers'
import { PlayerAction } from '../actions/PlayerActions'
import { IGameState, IUnit } from '../models'
import { GameEvent, UnitUpdated } from '../actions/GameEvents'
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
    case 'AttackUnit':
      return attackUnit(
        s,
        a.attackingUnitId,
        a.attackedUnitId,
        executingPlayerId,
      )
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

  // refresh units
  const updateUnitEvents: UnitUpdated[] = []
  s = updateUnits(s, unit => {
    let actionPoints, movePoints

    if (unit.playerId == activePlayerId) {
      actionPoints = 2
      movePoints = UnitTypes[unit.unitTypeId].movePoints
    } else {
      actionPoints = 0
      movePoints = 0
    }

    updateUnitEvents.push({
      type: 'UnitUpdated',
      unitId: unit.unitId,
      actionPoints,
      movePoints,
    })

    return { actionPoints, movePoints }
  })

  return {
    nextState: s,
    events: sendToAllPlayers(
      s,
      {
        type: 'TurnStarted',
        activePlayerId,
      },
      ...updateUnitEvents,
    ),
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
    hitPoints: UnitTypes[unitTypeId].hitPoints,
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
    throw Error('Invalid moveUnit')
  }

  const unit = s.units[unitId]
  const targetTileId = last(path)!

  const actionPoints = unit.actionPoints - 1

  s = updateTile(s, unit.tileId, { unitId: undefined })
  s = updateTile(s, targetTileId, { unitId })
  s = updateUnit(s, unitId, {
    tileId: targetTileId,
    actionPoints,
  })

  return {
    nextState: s,
    events: sendToAllPlayers(
      s,
      {
        type: 'UnitMoved',
        unitId,
        path,
      },
      {
        type: 'UnitUpdated',
        unitId,
        actionPoints,
      },
    ),
  }
}

function attackUnit(
  s: IGameState,
  attackingUnitId: string,
  attackedUnitId: string,
  executingPlayerId: string,
): IGameStateAndEvents {
  if (!canAttack(s, attackingUnitId, attackedUnitId, executingPlayerId)) {
    throw 'invalid attackUnit'
  }

  const events: GameEvent[] = []

  const attacker = s.units[attackingUnitId]
  const attacked = s.units[attackedUnitId]

  const damage = UnitTypes[attacker.unitTypeId].attackDamage
  const remainingHitpoints = attacked.hitPoints - damage
  const killed = remainingHitpoints <= 0

  s = updateUnit(s, attackingUnitId, { actionPoints: 0 })
  events.push({
    type: 'UnitUpdated',
    unitId: attackingUnitId,
    actionPoints: 0,
  })

  if (killed) {
    s = removeUnit(s, attackedUnitId)
    events.push({
      type: 'UnitUpdated',
      unitId: attackedUnitId,
      hitPoints: 0,
    })
    events.push({
      type: 'UnitRemoved',
      unitId: attackedUnitId,
    })
  } else {
    s = updateUnit(s, attackedUnitId, { hitPoints: remainingHitpoints })
    events.push({
      type: 'UnitUpdated',
      unitId: attackedUnitId,
      hitPoints: remainingHitpoints,
    })
  }

  return {
    nextState: s,
    events: sendToAllPlayers(s, ...events),
  }
}
