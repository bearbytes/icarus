import { IAction } from '../models'

export type UIAction = ClickOnTile | ClickOnUnitSpawnSelection | ClickOnEndTurn

export interface ClickOnTile extends IAction {
  type: 'ClickOnTile'
  tileId: string
}

export interface ClickOnUnitSpawnSelection extends IAction {
  type: 'ClickOnUnitSpawnSelection'
  unitTypeId: string
}

export interface ClickOnEndTurn extends IAction {
  type: 'ClickOnEndTurn'
}
