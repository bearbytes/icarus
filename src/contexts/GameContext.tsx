import * as React from 'react'
import { IGameState } from '../types'
import { UserAction } from '../actions'
import StateWrapper from '../components/StateWrapper'
import ServerConnection from '../server/ServerConnection'

export interface IGameContext {
  game: IGameState
  submitAction(action: UserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

export function GameContextProvider(props: { children: React.ReactNode }) {
  const { defaultValue, subscribe, submitAction } = ServerConnection
  return (
    <StateWrapper defaultState={defaultValue}>
      {(game, setGame) => {
        subscribe(setGame)
        return (
          <GameContext.Provider value={{ game, submitAction }}>
            {props.children}
          </GameContext.Provider>
        )
      }}
    </StateWrapper>
  )
}
