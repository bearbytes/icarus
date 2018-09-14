import * as React from 'react'
import { withStateFromObservable } from '../components/hoc/withState'
import { IClientState, IPlayer } from '../models'
import { ServerContext } from './ServerContext'
import { Subject, Observable, BehaviorSubject } from 'rxjs'
import { PlayerAction } from '../actions/PlayerActions'
import { GameEvent } from '../actions/GameEvents'
import { UIAction, ignoreInDevTools } from '../actions/UIActions'
import { createClientState } from '../state/createClientState'
import {
  ClientStateReducer,
  IClientStateAndActions,
} from '../state/ClientStateReducer'
import { connectDevTools } from '../lib/ReduxDevTools'
import { storeState, fetchState } from '../lib/persistState'

export interface IClientContext {
  clientState: IClientState
  dispatch(playerAction: UIAction): void
}

export const ClientContext = React.createContext<IClientContext>(null as any)

interface ClientContextProviderProps {
  playerName: string
  playerColor: string
  children: React.ReactNode
}

export function ClientContextProvider(props: ClientContextProviderProps) {
  const player: IPlayer = {
    playerId: props.playerName.toLowerCase(),
    name: props.playerName,
    color: props.playerColor,
  }

  const uiActionsSubject = new Subject<UIAction>()
  const gameEventsSubject = new Subject<GameEvent[]>()
  const {
    clientStateObservable,
    playerActionObservable,
  } = ClientStateChangeHandler(
    player.playerId,
    gameEventsSubject,
    uiActionsSubject,
  )

  function dispatch(playerAction: UIAction) {
    uiActionsSubject.next(playerAction)
  }

  return (
    <ServerContext.Consumer>
      {serverContext => {
        // side effect: TODO unsubscribe
        serverContext.serverProcess.connect({
          player,
          actions: playerActionObservable,
          sendEvents: events => gameEventsSubject.next(events),
        })
        return withStateFromObservable(clientStateObservable, clientState => {
          return (
            <ClientContext.Provider value={{ clientState, dispatch }}>
              {props.children}
            </ClientContext.Provider>
          )
        })
      }}
    </ServerContext.Consumer>
  )
}

function ClientStateChangeHandler(
  playerId: string,
  gameEventsObservable: Observable<GameEvent[]>,
  uiActionsObservable: Observable<UIAction>,
): {
  clientStateObservable: Observable<IClientState>
  playerActionObservable: Observable<PlayerAction>
} {
  const devTools = connectDevTools(playerId)

  const initialState =
    fetchState<IClientState>(playerId) || createClientState(playerId)
  const clientStateSubject = new BehaviorSubject<IClientState>(initialState)
  const playerActionSubject = new Subject<PlayerAction>()

  function updateState(e: GameEvent | UIAction) {
    const updateOrState = ClientStateReducer(clientStateSubject.value, e)

    const update = updateOrState as IClientStateAndActions
    const state = updateOrState as IClientState

    function sendToDevTool(nextState: any) {
      if (ignoreInDevTools(e)) return
      devTools.send(e, nextState)
      storeState(playerId, nextState)
    }

    if (!update.nextState && !update.actions && !update.action) {
      sendToDevTool(state)
      clientStateSubject.next(state)
    } else {
      sendToDevTool(update.nextState || clientStateSubject.value)

      if (update.nextState) {
        clientStateSubject.next(update.nextState)
      }
      if (update.action) {
        playerActionSubject.next(update.action)
      }
      if (update.actions) {
        for (const playerAction of update.actions) {
          playerActionSubject.next(playerAction)
        }
      }
    }
  }

  gameEventsObservable.subscribe(events => {
    for (const event of events) {
      updateState(event)
    }
  })

  uiActionsObservable.subscribe(action => {
    updateState(action)
  })

  return {
    clientStateObservable: clientStateSubject,
    playerActionObservable: playerActionSubject,
  }
}
