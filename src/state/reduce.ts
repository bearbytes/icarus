import { UserAction, ClickOnTile } from '../actions/UserActions'
import { IGameState, IUnit } from '../models'
import { createId } from '../lib/createId'
import { addUnit, updateTile, updatePlayer, getUnitOnTile } from './helpers'

export function reduce(
  s: IGameState,
  a: UserAction,
  executingPlayerId: string,
): IGameState {
  switch (a.type) {
    case 'ClickOnTile': {
      return clickOnTile(s, a, executingPlayerId)
    }
  }
}

function clickOnTile(
  s: IGameState,
  a: ClickOnTile,
  playerId: string,
): IGameState {
  const unit = getUnitOnTile(s, a.tileId)
  if (unit) {
    return selectUnit(s, unit.unitId, playerId)
  } else {
    if (playerId != s.activePlayerId) {
      return s
    }
    return spawnUnit(s, a, playerId)
  }
}

function spawnUnit(
  s: IGameState,
  a: ClickOnTile,
  playerId: string,
): IGameState {
  const unitId = createId('unit')
  const unit: IUnit = {
    unitId,
    playerId,
  }
  s = addUnit(s, unit)
  s = updateTile(s, a.tileId, { unitId })
  return s
}

function selectUnit(
  s: IGameState,
  unitId: string,
  playerId: string,
): IGameState {
  return updatePlayer(s, playerId, { selectedUnitId: unitId })
}
