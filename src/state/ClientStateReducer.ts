import {
  GameEvent,
  GameStarted,
  UnitMoved,
  UnitSpawned,
  TurnStarted,
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
import {
  getSelectedUnit,
  updateUI,
  updateGame,
  isMyTurn,
  isMyUnit,
  getMovementTargetTileId,
} from './ClientStateHelpers'
import log from '../lib/log'

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
      return gameStarted(s, a)
    case 'TurnStarted':
      return turnStarted(s, a)
    case 'UnitMoved':
      return unitMoved(s, a)
    case 'UnitSpawned':
      return unitSpawned(s, a)

    // Actions
    case 'ClickOnTile':
      return clickOnTile(s, a)
    case 'ClickOnUnitSpawnSelection':
      return clickOnUnitSpawnSelection(s, a)
    case 'ClickOnEndTurn':
      return clickOnEndTurn(s)
  }
}

function gameStarted(
  s: IClientState,
  { initialState }: GameStarted,
): IClientState {
  s = { ...s, game: initialState }
  return s
}

function turnStarted(
  s: IClientState,
  { activePlayerId }: TurnStarted,
): IClientState {
  s = updateGame(s, { activePlayerId })
  return s
}

function unitMoved(
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
    s = updateTileHighlights(s)
  }

  return s
}

function unitSpawned(s: IClientState, { unit }: UnitSpawned): IClientState {
  let g = s.game
  g = addUnit(g, unit)
  g = updateTile(g, unit.tileId, { unitId: unit.unitId })
  return { ...s, game: g }
}

function clickOnTile(
  s: IClientState,
  { tileId }: ClickOnTile,
): IClientStateAndActions {
  // Try to select a unit on that tile
  const unit = getUnitOnTile(s.game, tileId)
  if (unit) {
    s = selectUnit(s, unit.unitId)
    return { nextState: s }
  }

  // Try to spawn a unit on that tile
  const spawnUnitTypeId = s.ui.selectedUnitSpawnTypeId
  if (spawnUnitTypeId) {
    if (isMyTurn(s)) {
      return {
        nextState: s,
        action: {
          type: 'SpawnUnit',
          tileId,
          unitTypeId: spawnUnitTypeId,
        },
      }
    }
  }

  // Try to move a selected unit to that tile
  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit && isMyUnit(s, selectedUnit.unitId)) {
    // If we previously selected that tile as target, move the unit
    if (getMovementTargetTileId(s) == tileId) {
      if (isMyTurn(s)) {
        return moveUnit(s, tileId)
      }
    }

    // otherwise, first click only selects the tile as target
    s = createMovementPathToTile(s, tileId)
    return { nextState: s }
  }

  return { nextState: s }
}

function selectUnit(s: IClientState, unitId: string): IClientState {
  s = updateUI(s, { selectedUnitId: unitId, selectedUnitSpawnTypeId: null })
  s = updateTileHighlights(s)
  return s
}

function deselectUnit(s: IClientState): IClientState {
  const unit = getSelectedUnit(s)
  if (!unit) return s
  return updateUI(s, {
    selectedUnitId: null,
    tileHighlights: {},
    movementPathTileIds: [],
  })
}

function moveUnit(s: IClientState, tileId: string): IClientStateAndActions {
  const unit = getSelectedUnit(s)
  if (!unit) return { nextState: s }

  s = updateUI(s, { movementPathTileIds: [] })

  return {
    nextState: s,
    action: {
      type: 'MoveUnit',
      unitId: unit.unitId,
      tileId,
    },
  }
}

function clickOnUnitSpawnSelection(
  s: IClientState,
  { unitTypeId }: ClickOnUnitSpawnSelection,
): IClientState {
  s = deselectUnit(s)

  const alreadySelected = s.ui.selectedUnitSpawnTypeId === unitTypeId
  const selectedUnitSpawnTypeId = alreadySelected ? null : unitTypeId

  return updateUI(s, { selectedUnitSpawnTypeId })
}

function updateTileHighlights(s: IClientState): IClientState {
  const tileHighlights = {}

  const unit = getSelectedUnit(s)
  if (unit) {
    const area = getValidMovementTargets(s.game, unit.unitId)
    for (const tile of area) {
      tileHighlights[tile.tileId] = {
        borderColor: '#888',
      }
    }
  }

  const movementPath = s.ui.movementPathTileIds
  if (movementPath) {
    for (const tileId of movementPath) {
      tileHighlights[tileId] = {
        borderColor: '#fff',
      }
    }
  }

  return updateUI(s, { tileHighlights })
}

function clickOnEndTurn(s: IClientState): IClientStateAndActions {
  if (!isMyTurn(s)) {
    return {}
  }

  return {
    action: { type: 'EndTurn' },
  }
}

function createMovementPathToTile(
  s: IClientState,
  targetTileId: string,
): IClientState {
  const startTileId = getMovementTargetTileId(s)
  if (startTileId) {
    return createMovementPath(startTileId)
  }

  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit) {
    return createMovementPath(selectedUnit.tileId)
  }

  log.warn('createMovementPathToTile')
  return s

  function createMovementPath(startTileId: string): IClientState {
    const path = getPathToTarget(s.game, startTileId, targetTileId) || []
    const movementPathTileIds = [
      ...s.ui.movementPathTileIds,
      ...path.map(tile => tile.tileId),
    ]
    s = updateUI(s, { movementPathTileIds })
    s = updateTileHighlights(s)
    return s
  }
}
