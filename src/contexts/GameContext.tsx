import * as React from 'react'
import { UserAction } from '../actions/UserActions'
import { withStateFromObservable } from '../components/hoc/withState'
import ServerConnection from '../server/ServerConnection'
import { IGameState } from '../models'

export interface IGameContext {
  game: IGameState
  dispatch(action: UserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

export function GameContextProvider(props: { children: React.ReactNode }) {
  const { gameObservable, dispatch } = ServerConnection
  return withStateFromObservable(gameObservable, game => (
    <GameContext.Provider value={{ game, dispatch }}>
      {props.children}
    </GameContext.Provider>
  ))
}
