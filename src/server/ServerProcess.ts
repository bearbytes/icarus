import { Observable } from 'rxjs'
import { IGameState, IPlayer } from '../models'
import { GameEvent } from '../actions/GameEvents'
import { PlayerAction } from '../actions/PlayerActions'
import { createGameState } from './createGameState'
import { GameStateReducer } from './GameStateReducer'
import { connectDevTools } from '../lib/ReduxDevTools'

export interface IServerProcess {
  connect(client: IClientConnection): void
}

export interface IClientConnection {
  player: IPlayer
  actions: Observable<PlayerAction>
  sendEvents(event: GameEvent[]): void
}

export function createServerProcess(): IServerProcess {
  const devTools = connectDevTools('Server')
  let game: IGameState | null = null
  const clients: IClientConnection[] = []

  function startGame() {
    const players = clients.map(client => client.player)
    game = createGameState(players)

    for (const client of clients) {
      client.actions.subscribe(playerAction =>
        handlePlayerAction(playerAction, client.player.playerId),
      )
    }

    for (const client of clients) {
      client.sendEvents([
        {
          type: 'GameStarted',
          initialState: { ...game }, // TODO remove copy as soon as we serialize the state
        },
      ])
    }
  }

  function handlePlayerAction(playerAction: PlayerAction, playerId: string) {
    const update = GameStateReducer(game!, playerAction, playerId)
    devTools.send(playerAction, update.nextState)
    game = update.nextState

    for (const client of clients) {
      const events = update.events[client.player.playerId]
      client.sendEvents(events)
    }
  }

  function connect(client: IClientConnection) {
    if (game) {
      throw "Can't connect while game is in progress"
    }

    clients.push(client)

    if (clients.length == 2) {
      startGame()
    }
  }

  return { connect }
}
