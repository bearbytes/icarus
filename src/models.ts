import { HexCoord } from './types'

export interface IAction {
  type: string
}

export interface IGameState {
  map: IHexagonMap
  units: { [unitId: string]: IUnit }
  players: { [playerId: string]: IPlayer }

  activePlayerId: string
}

export interface IPlayer {
  playerId: string

  selectedUnitId: string | null
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}

export interface IHexagonMapTile {
  id: string
  coord: HexCoord
  color: string
  unitId?: string
}

export interface IUnit {
  unitId: string
}
