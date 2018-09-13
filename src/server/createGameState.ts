import { IGameState, IPlayer, IHexagonMap } from '../models'
import { createMap } from '../lib/MapCreator'
import { fetchState } from '../lib/persistState'

export function createGameState(playerList: IPlayer[]): IGameState {
  const map = fetchState<IHexagonMap>('default-map') || createMap()

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
