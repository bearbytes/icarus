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

export function getMovementTargetTileId(s: IClientState): string | null {
  const pathLength = s.ui.movementPathTileIds.length
  if (pathLength == 0) return null

  return s.ui.movementPathTileIds[pathLength - 1]
}
