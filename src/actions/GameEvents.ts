import { IAction, IUnit } from '../models'

export type GameEvent = UnitSpawned | UnitMoved

export interface UnitSpawned extends IAction {
  type: 'UnitSpawned'
  unit: IUnit
}

export interface UnitMoved extends IAction {
  type: 'UnitMoved'
  unitId: string
  tileId: string
}
