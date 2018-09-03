import {
  UserAction,
  ClickOnTile,
  ClickOnUnitSpawnSelection,
} from '../actions/UserActions'
import { IGameState, IUnit } from '../models'
import { createId } from '../lib/createId'
import {
  addUnit,
  updateTile,
  updatePlayer,
  getUnitOnTile,
  getTileOfUnit,
  updateUnit,
  getSelectedUnitOfPlayer,
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
    case 'ClickOnUnitSpawnSelection': {
      return clickOnUnitSpawnSelection(s, a, executingPlayerId)
    }
  }
}

function clickOnTile(
  s: IGameState,
  a: ClickOnTile,
  playerId: string,
): IGameState {
  // each player may select a unit on the tile
  const unit = getUnitOnTile(s, a.tileId)
  if (unit) {
    return selectUnit(s, unit.unitId, playerId)
  }

  // only the active player may do the other things
  if (playerId != s.activePlayerId) {
    return s
  }

  // the player may move a selected unit to that tile
  const selectedUnit = getSelectedUnitOfPlayer(s, playerId)
  if (selectedUnit) {
    return moveUnit(s, selectedUnit.unitId, a.tileId)
  }

  // otherwise, spawn a unit on that tile
  return spawnUnit(s, a, playerId)
}

function clickOnUnitSpawnSelection(
  s: IGameState,
  a: ClickOnUnitSpawnSelection,
  playerId: string,
): IGameState {
  s = updatePlayer(s, playerId, {
    selectedUnitId: null,
    selectedUnitSpawnTypeId: a.unitTypeId,
  })
  return s
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
  s = updateHighlightedTiles(s)
  return s
}

function moveUnit(s: IGameState, unitId: string, tileId: string): IGameState {
  const unit = s.units[unitId]
  s = updateTile(s, unit.tileId, { unitId: undefined })
  s = updateTile(s, tileId, { unitId })
  s = updateUnit(s, unitId, { tileId })
  s = updateHighlightedTiles(s)
  return s
}

function updateHighlightedTiles(s: IGameState) {
  const unit = getSelectedUnitOfPlayer(s, s.activePlayerId)
  if (!unit) return s

  // Highlight tiles where unit can move
  const unitTile = getTileOfUnit(s, unit.unitId)
  const highlightedTileIds = []
  const area = unitTile.coord.area(2)
  for (const coord of area) {
    const tileId = coord.id
    if (tileId != unitTile.tileId) {
      highlightedTileIds.push(tileId)
    }
  }

  return { ...s, highlightedTileIds }
}
