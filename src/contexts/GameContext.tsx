import * as React from 'react'
import { IGameState } from '../types'
import { createGameState } from '../state/createGameState'

export interface IGameContext {
  game: IGameState
  submitAction(action: IUserAction): void
}

export const GameContext = React.createContext<IGameContext>(null as any)

export function GameContextProvider(props: { children: React.ReactNode }) {
  return (
    <GameContext.Provider
      value={{
        game: createGameState(),
        submitAction: action => {},
      }}
    >
      {props.children}
    </GameContext.Provider>
  )
}

interface IUserAction {
  type: string
}
