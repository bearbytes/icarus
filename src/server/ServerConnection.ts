import { createGameState } from '../state/createGameState'
import { UserAction } from '../actions'
import { IGameState } from '../types'
import { BehaviorSubject, Observable } from 'rxjs'

const gameSubject = new BehaviorSubject(createGameState())

function dispatch(action: UserAction) {
  console.log('submitted action', action)
}

export default {
  gameObservable: gameSubject as Observable<IGameState>,
  dispatch,
}
