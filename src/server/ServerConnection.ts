import { createGameState } from '../state/createGameState'
import { UserAction } from '../actions/UserActions'
import { BehaviorSubject, Observable } from 'rxjs'
import { reduce } from '../state/reduce'
import { IGameState } from '../models'

const gameSubject = new BehaviorSubject(createGameState())

const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
const devToolsConnection = devTools ? devTools.connect() : null

if (devToolsConnection) {
  devToolsConnection.init(gameSubject.value)
}

function dispatch(action: UserAction) {
  const prevState = gameSubject.value
  const nextState = reduce(prevState, action)

  if (devToolsConnection) {
    devToolsConnection.send(action, nextState)
  }

  gameSubject.next(nextState)
}

export default {
  gameObservable: gameSubject as Observable<IGameState>,
  dispatch,
}
