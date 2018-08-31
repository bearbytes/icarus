import { createGameState } from '../state/createGameState'
import { UserAction } from '../actions'
import { IGameState } from '../types'

let value = createGameState()

type Listener = (value: IGameState) => void
const listeners = [] as Listener[]

function subscribe(listener: Listener) {
  listeners.push(listener)
}

function submitAction(action: UserAction) {
  console.log('submitted action', action)
}

export default { value, subscribe, submitAction }
