import { HexCoord } from './types'

export interface IAction {
  type: string
}

export interface IGameState {
  map: IHexagonMap
  units: { [unitId: string]: IUnit }
  players: { [playerId: string]: IPlayer }

  localPlayerId: string
  activePlayerId: string
  highlightedTileIds: string[]
}

export interface IPlayer {
  playerId: string

  selectedUnitId: string | null
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}

export interface IHexagonMapTile {
  tileId: string
  coord: HexCoord
  color: string
  unitId?: string
}

export interface IUnit {
  unitId: string
  playerId: string
  tileId: string
}
