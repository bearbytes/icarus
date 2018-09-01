import { UserAction } from '../actions/UserActions'
import { spawnUnit } from './spawnUnit'
import { IGameState } from '../models'

export function reduce(s: IGameState, a: UserAction): IGameState {
  switch (a.type) {
    case 'ClickOnTile': {
      return spawnUnit(s, a)
    }
  }
}
