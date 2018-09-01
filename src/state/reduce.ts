import { IGameState } from '../types'
import { UserAction } from '../actions'
import { spawnUnit } from './spawnUnit'

export function reduce(s: IGameState, a: UserAction): IGameState {
  switch (a.type) {
    case 'ClickOnTile': {
      return spawnUnit(s, a)
    }
  }
}
