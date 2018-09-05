import { IAction, IUnit, IGameState } from '../models'

export type GameEvent = GameStarted | UnitSpawned | UnitMoved

export interface GameStarted extends IAction {
  type: 'GameStarted'
  initialState: IGameState
}

export interface UnitSpawned extends IAction {
  type: 'UnitSpawned'
  unit: IUnit
}

export interface UnitMoved extends IAction {
  type: 'UnitMoved'
  unitId: string
  tileId: string
}
