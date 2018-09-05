import * as React from 'react'
import { UserAction } from '../actions/UserActions'
import { withStateFromObservable } from '../components/hoc/withState'
import { connectToServer } from '../server/ServerConnection'
import { IGameState, IClientState } from '../models'

export interface IClientContext {
  clientState: IClientState
  dispatch(action: UserAction): void
}

export const ClientContext = React.createContext<IClientContext>(null as any)

interface ClientContextProviderProps {
  playerName: string
  children: React.ReactNode
}

export function ClientContextProvider(props: ClientContextProviderProps) {
  const { clientStateObservable, dispatch } = connectToServer(props.playerName)
  return withStateFromObservable(clientStateObservable, clientState => (
    <ClientContext.Provider value={{ clientState, dispatch }}>
      {props.children}
    </ClientContext.Provider>
  ))
}
