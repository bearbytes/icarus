import * as React from 'react'
import { UserAction } from '../actions/UserActions'
import { withStateFromObservable } from '../components/hoc/withState'
import { connectToServer } from '../server/ServerConnection'
import { IGameState } from '../models'

export interface IGameContext {
  game: IGameState
  dispatch(action: UserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

interface GameContextProviderProps {
  playerName: string
  children: React.ReactNode
}

export function GameContextProvider(props: GameContextProviderProps) {
  const { gameObservable, dispatch } = connectToServer(props.playerName)
  return withStateFromObservable(gameObservable, game => (
    <GameContext.Provider value={{ game, dispatch }}>
      {props.children}
    </GameContext.Provider>
  ))
}
