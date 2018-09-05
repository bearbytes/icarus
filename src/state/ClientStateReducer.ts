import {
  GameEvent,
  GameStarted,
  UnitMoved,
  UnitSpawned,
  TurnStarted,
} from '../actions/GameEvents'
import { IClientState, IGameState } from '../models'
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
import { getSelectedUnit, updateUI, updateGame } from './ClientStateHelpers'

export interface IClientStateAndActions {
  nextState?: IClientState
  actions?: PlayerAction[]
  action?: PlayerAction
}

export function ClientStateReducer(
  s: IClientState,
  a: UIAction | GameEvent,
): IClientState | IClientStateAndActions {
  switch (a.type) {
    // Events
    case 'GameStarted':
      return startGame(s, a)
    case 'TurnStarted':
      return startTurn(s, a)
    case 'UnitMoved':
      return moveUnit(s, a)
    case 'UnitSpawned':
      return spawnUnit(s, a)

    // Actions
    case 'ClickOnTile':
      return clickOnTile(s, a)
    case 'ClickOnUnitSpawnSelection':
      return clickOnUnitSpawnSelection(s, a)
    case 'ClickOnEndTurn':
      return clickOnEndTurn(s)
  }
}

function startGame(
  s: IClientState,
  { initialState }: GameStarted,
): IClientState {
  s = { ...s, game: initialState }
  return s
}

function startTurn(
  s: IClientState,
  { activePlayerId }: TurnStarted,
): IClientState {
  s = updateGame(s, { activePlayerId })
  return s
}

function moveUnit(
  s: IClientState,
  { unitId, tileId }: UnitMoved,
): IClientState {
  const unit = s.game.units[unitId]

  s = updateGame(s, g => {
    g = updateTile(g, unit.tileId, { unitId: undefined })
    g = updateTile(g, tileId, { unitId })
    g = updateUnit(g, unitId, { tileId })
    return g
  })

  if (unit.unitId == s.ui.selectedUnitId) {
    s = highlightMovableArea(s)
  }

  return s
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
    s = updateUI(s, { targetTileId: null })
    return {
      nextState: s,
      action: {
        type: 'SpawnUnit',
        tileId,
        unitTypeId: spawnUnitTypeId,
      },
    }
  }

  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit) {
    // If we previously selected that tile as target, move the unit
    if (s.ui.targetTileId == tileId) {
      return {
        action: {
          type: 'MoveUnit',
          unitId: selectedUnit.unitId,
          tileId,
        },
      }
    }

    // otherwise, first click only selects the tile as target
    s = highlightMovablePath(s, tileId)
    return { nextState: s }
  }

  return { nextState: s }
}

function selectUnit(s: IClientState, unitId: string): IClientState {
  s = updateUI(s, { selectedUnitId: unitId, selectedUnitSpawnTypeId: null })
  s = highlightMovableArea(s)
  return s
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

function highlightMovableArea(s: IClientState): IClientState {
  const unit = getSelectedUnit(s)
  if (!unit) {
    return updateUI(s, { targetTileId: null })
  }

  const highlightedTiles = getValidMovementTargets(s.game, unit.unitId)
  const highlightedTileIds = highlightedTiles.map(tile => tile.tileId)
  return updateUI(s, { highlightedTileIds, targetTileId: null })
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

function clickOnEndTurn(s: IClientState): IClientStateAndActions {
  return {
    action: { type: 'EndTurn' },
  }
}
