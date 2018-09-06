import {
  IClientState,
  IUnit,
  IUIState,
  IGameState,
  IHexagonMapTile,
} from '../models'

export function updateGame(
  s: IClientState,
  partialOrUpdate: Partial<IGameState> | ((g: IGameState) => IGameState),
): IClientState {
  if (typeof partialOrUpdate === 'function') {
    return { ...s, game: partialOrUpdate(s.game) }
  }
  const game = { ...s.game, ...partialOrUpdate }
  return { ...s, game }
}

export function updateUI(
  s: IClientState,
  partial: Partial<IUIState>,
): IClientState {
  const ui = { ...s.ui, ...partial }
  return { ...s, ui }
}

export function getSelectedUnit(s: IClientState): IUnit | null {
  const unitId = s.ui.selectedUnitId
  if (!unitId) return null
  return s.game.units[unitId]
}

export function isMyTurn(s: IClientState): boolean {
  return s.game.activePlayerId == s.ui.localPlayerId
}

export function isMyUnit(s: IClientState, unitId: string): boolean {
  return s.game.units[unitId].playerId == s.ui.localPlayerId
}

export function getMovementStartTileId(s: IClientState): string | null {
  const targetTileId = getMovementTargetTileId(s)
  if (targetTileId) return targetTileId

  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit) return selectedUnit.tileId

  return null
}

export function getMovementTargetTileId(s: IClientState): string | null {
  const pathLength = s.ui.movementPathTileIds.length
  if (pathLength == 0) return null

  return s.ui.movementPathTileIds[pathLength - 1]
}

export function getRemainingMovePoints(s: IClientState): number | null {
  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit) return 2 // TODO

  return null
}
