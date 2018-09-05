import { createClientState } from '../state/createClientState'
import { UserAction } from '../actions/UserActions'
import { BehaviorSubject, Observable } from 'rxjs'
import { reduce } from '../state/reduce'
import { IClientState } from '../models'

interface IServerConnection {
  clientStateObservable: Observable<IClientState>
  dispatch(action: UserAction): void
}

export function connectToServer(playerName: string): IServerConnection {
  const playerId = playerName.toLowerCase()

  const clientStateSubject = new BehaviorSubject(createClientState(playerId))

  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  const devToolsConnection = devTools ? devTools.connect() : null

  if (devToolsConnection) {
    devToolsConnection.init(clientStateSubject.value)
  }

  function dispatch(action: UserAction) {
    const prevState = clientStateSubject.value
    const nextState = reduce(prevState, action, playerId)

    if (devToolsConnection) {
      devToolsConnection.send(action, nextState)
    }

    clientStateSubject.next(nextState)
  }

  return {
    clientStateObservable: clientStateSubject,
    dispatch,
  }
}
