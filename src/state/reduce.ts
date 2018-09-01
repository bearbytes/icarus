import { UserAction, ClickOnTile } from '../actions/UserActions'
import { IGameState, IUnit } from '../models'
import { createId } from '../lib/createId'
import {
  addUnit,
  updateTile,
  updatePlayer,
  getUnitOnTile,
  getTileOfUnit,
} from './helpers'

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
    tileId: a.tileId,
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
  s = updatePlayer(s, playerId, { selectedUnitId: unitId })

  // Highlight tiles where unit can move
  const unitTile = getTileOfUnit(s, unitId)
  const highlightedTileIds = []
  const area = unitTile.coord.area(2)
  for (const coord of area) {
    const tileId = coord.id
    if (tileId != unitTile.tileId) {
      highlightedTileIds.push(tileId)
    }
  }

  s = { ...s, highlightedTileIds }
  return s
}
