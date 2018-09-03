import { IAction } from '../models'

export type UserAction = ClickOnTile | ClickOnUnitSpawnSelection

export interface ClickOnTile extends IAction {
  type: 'ClickOnTile'
  tileId: string
}

export interface ClickOnUnitSpawnSelection extends IAction {
  type: 'ClickOnUnitSpawnSelection'
  unitTypeId: string
}
