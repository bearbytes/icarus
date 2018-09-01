import * as React from 'react'
import { IGameState } from '../types'
import { UserAction } from '../actions'
import { withStateFromObservable } from '../components/hoc/withState'
import ServerConnection from '../server/ServerConnection'

export interface IGameContext {
  game: IGameState
  submitAction(action: UserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

export function GameContextProvider(props: { children: React.ReactNode }) {
  const { gameObservable, submitAction } = ServerConnection
  return withStateFromObservable(gameObservable, game => (
    <GameContext.Provider value={{ game, submitAction }}>
      {props.children}
    </GameContext.Provider>
  ))
}
