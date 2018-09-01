import { IAction } from '../models'

export type UserAction = ClickOnTile

export interface ClickOnTile extends IAction {
  type: 'ClickOnTile'
  tileId: string
}
