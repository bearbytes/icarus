import { IGameState, IPlayer } from '../models'
import { createMap } from '../lib/MapCreator'

export function createGameState(playerList: IPlayer[]): IGameState {
  const map = createMap()

  const units = {}

  const players = {}
  for (const player of playerList) {
    players[player.playerId] = player
  }

  return {
    map,
    units,
    players,
    activePlayerId: playerList[0].playerId,
  }
}
