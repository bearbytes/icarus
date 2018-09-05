import { IClientState, IUnit, IUIState } from '../models'

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
