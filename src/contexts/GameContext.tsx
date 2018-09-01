import * as React from 'react'
import { IGameState } from '../types'
import { UserAction } from '../actions'
import { withState } from '../components/hoc/withState'
import ServerConnection from '../server/ServerConnection'

export interface IGameContext {
  game: IGameState
  submitAction(action: UserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

export function GameContextProvider(props: { children: React.ReactNode }) {
  const { value, subscribe, submitAction } = ServerConnection
  return withState(value, (game, setGame) => {
    subscribe(setGame) // TODO memory leak, fix plx
    return (
      <GameContext.Provider value={{ game, submitAction }}>
        {props.children}
      </GameContext.Provider>
    )
  })
}
