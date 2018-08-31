import { IAction } from '../types'

export interface ClickOnTile extends IAction {
  type: 'ClickOnTile'
  tileId: string
}
