import { createGameState } from '../state/createGameState'
import { UserAction } from '../actions'
import { IGameState } from '../types'
import * as Bacon from 'baconjs'

const defaultValue = createGameState()
const GameStateObservable = Bacon.constant(defaultValue)

function subscribe(listener: (value: IGameState) => void) {
  GameStateObservable.changes().onValue(listener)
}

function submitAction(action: UserAction) {
  console.log('submitted action', action)
}

export default { defaultValue, subscribe, submitAction }
