import { IAction } from '../models'

export type PlayerAction = SpawnUnit | MoveUnit

export interface SpawnUnit extends IAction {
  type: 'SpawnUnit'
  unitTypeId: string
  tileId: string
}

export interface MoveUnit extends IAction {
  type: 'ClickOnUnitSpawnSelection'
  unitId: string
  tileId: string
}
