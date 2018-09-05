import { IUnit, IGameState } from '../models'

export type GameEvent = GameStarted | UnitSpawned | UnitMoved | TurnStarted

export interface GameStarted {
  type: 'GameStarted'
  initialState: IGameState
}

export interface UnitSpawned {
  type: 'UnitSpawned'
  unit: IUnit
}

export interface UnitMoved {
  type: 'UnitMoved'
  unitId: string
  tileId: string
}

export interface TurnStarted {
  type: 'TurnStarted'
  activePlayerId: string
}
