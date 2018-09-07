import { IUnit, IGameState } from '../models'

export type GameEvent =
  | GameStarted
  | TurnStarted
  | UnitSpawned
  | UnitMoved
  | UnitUpdated
  | UnitRemoved

export interface GameStarted {
  type: 'GameStarted'
  initialState: IGameState
}

export interface TurnStarted {
  type: 'TurnStarted'
  activePlayerId: string
}

export interface UnitSpawned {
  type: 'UnitSpawned'
  unit: IUnit
}

export interface UnitMoved {
  type: 'UnitMoved'
  unitId: string
  path: string[]
}

export interface UnitUpdated {
  type: 'UnitUpdated'
  unitId: string
  movePoints?: number
  actionPoints?: number
  hitPoints?: number
}

export interface UnitRemoved {
  type: 'UnitRemoved'
  unitId: string
}
