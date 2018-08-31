import { createGameState } from './state/createGameState'
import { UserAction } from './actions'
import { IGameState } from './types'
import * as Bacon from 'baconjs'

const GameStateObservable = Bacon.constant(createGameState())
function submitAction(action: UserAction) {}

const ServerConnection = {
  value: createGameState(),
  subscribe: (listener: (value: IGameState) => void) =>
    GameStateObservable.skip(1).onValue(listener),
  submitAction: (action: UserAction) => {
    console.log('submitted action', action)
  },
}

export default ServerConnection
