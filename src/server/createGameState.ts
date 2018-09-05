import { IGameState, IPlayer, IHexagonMap, IHexagonMapTile } from '../models'
import { HexCoord } from '../types'
import { zipObj } from 'ramda'
import * as Color from 'color'

export function createGameState(playerList: IPlayer[]): IGameState {
  const map = createHexagonMap()

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

function createHexagonMap(): IHexagonMap {
  const radius = 15
  const coordinates = new HexCoord(0, 0).area(radius)
  const tiles = zipObj(
    coordinates.map(c => c.id),
    coordinates.map(c => createHexagonMapTile(c, radius)),
  )
  return { tiles }
}

function createHexagonMapTile(
  coord: HexCoord,
  radius: number,
): IHexagonMapTile {
  const r = ((coord.a / radius + 1) / 2) * 255
  const g = ((coord.b / radius + 1) / 2) * 255
  const b = ((coord.c / radius + 1) / 2) * 255
  let color = Color({ r, g, b }).toString()
  let blocked = undefined

  if (Math.random() < 0.1) {
    blocked = true
    color = 'black'
  }

  return {
    tileId: coord.id,
    coord,
    color,
    blocked,
  }
}
