import {
  GameEvent,
  GameStarted,
  UnitMoved,
  UnitSpawned,
} from '../actions/GameEvents'
import { IClientState } from '../models'
import { PlayerAction } from '../actions/PlayerActions'
import {
  ClickOnTile,
  ClickOnUnitSpawnSelection,
  UIAction,
} from '../actions/UIActions'
import {
  getUnitOnTile,
  getValidMovementTargets,
  getPathToTarget,
  updateTile,
  updateUnit,
  addUnit,
} from './GameStateHelpers'
import { getSelectedUnit, updateUI } from './ClientStateHelpers'

export interface IClientStateAndActions {
  nextState?: IClientState
  actions?: PlayerAction[]
}

export function ClientStateReducer(
  s: IClientState,
  a: UIAction | GameEvent,
): IClientState | IClientStateAndActions {
  switch (a.type) {
    // Events
    case 'GameStarted':
      return startGame(s, a)
    case 'UnitMoved':
      return moveUnit(s, a)
    case 'UnitSpawned':
      return spawnUnit(s, a)

    // Actions
    case 'ClickOnTile':
      return clickOnTile(s, a)
    case 'ClickOnUnitSpawnSelection':
      return clickOnUnitSpawnSelection(s, a)
  }
}

function startGame(s: IClientState, a: GameStarted): IClientState {
  s = { ...s, game: a.initialState }
  return s
}

function moveUnit(
  s: IClientState,
  { unitId, tileId }: UnitMoved,
): IClientState {
  let g = s.game
  const unit = g.units[unitId]
  g = updateTile(g, unit.tileId, { unitId: undefined })
  g = updateTile(g, tileId, { unitId })
  g = updateUnit(g, unitId, { tileId })
  return { ...s, game: g }
}

function spawnUnit(s: IClientState, { unit }: UnitSpawned): IClientState {
  let g = s.game
  g = addUnit(g, unit)
  g = updateTile(g, unit.tileId, { unitId: unit.unitId })
  return { ...s, game: g }
}

function clickOnTile(
  s: IClientState,
  { tileId }: ClickOnTile,
): IClientStateAndActions {
  const unit = getUnitOnTile(s.game, tileId)
  if (unit) {
    s = selectUnit(s, unit.unitId)
    return { nextState: s }
  }

  const spawnUnitTypeId = s.ui.selectedUnitSpawnTypeId
  if (spawnUnitTypeId) {
    return {
      actions: [
        {
          type: 'SpawnUnit',
          tileId,
          unitTypeId: spawnUnitTypeId,
        },
      ],
    }
  }

  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit) {
    // If we previously selected that tile as target, move the unit
    if (s.ui.targetTileId == tileId) {
      return {
        actions: [
          {
            type: 'MoveUnit',
            unitId: selectedUnit.unitId,
            tileId,
          },
        ],
      }
    }

    // otherwise, first click only selects the tile as target
    s = highlightMovablePath(s, tileId)
    return { nextState: s }
  }

  return { nextState: s }
}

function selectUnit(s: IClientState, unitId: string): IClientState {
  return updateUI(s, { selectedUnitId: unitId, selectedUnitSpawnTypeId: null })
}

function clickOnUnitSpawnSelection(
  s: IClientState,
  { unitTypeId }: ClickOnUnitSpawnSelection,
): IClientState {
  const alreadySelected = s.ui.selectedUnitSpawnTypeId === unitTypeId

  return updateUI(s, {
    selectedUnitId: null,
    selectedUnitSpawnTypeId: alreadySelected ? null : unitTypeId,
    highlightedTileIds: [],
    targetTileId: null,
  })
}

function highlightMovablePath(
  s: IClientState,
  targetTileId: string,
): IClientState {
  const unit = getSelectedUnit(s)
  if (!unit) {
    return updateUI(s, { highlightedTileIds: [], targetTileId: null })
  }

  const path = getPathToTarget(s.game, unit.tileId, targetTileId)
  if (!path) {
    return updateUI(s, { highlightedTileIds: [], targetTileId: null })
  }

  const highlightedTiles = path
  const highlightedTileIds = highlightedTiles.map(tile => tile.tileId)
  return updateUI(s, { highlightedTileIds, targetTileId })
}
