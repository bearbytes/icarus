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

export interface IClientState extends IGameState {
  localPlayerId: string

  highlightedTileIds: string[]
  targetTileId?: string

  selectedUnitId: string | null
  selectedUnitSpawnTypeId: string | null
}

export interface IServerState extends IGameState {}

export interface IPlayer {
  playerId: string
  color: string
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}

export interface IHexagonMapTile {
  tileId: string
  coord: HexCoord
  color: string
  unitId?: string
  blocked?: boolean
}

export interface IUnit {
  unitId: string
  unitTypeId: string
  playerId: string
  tileId: string
}

export interface IUnitType {
  unitTypeId: string
  svgPath: string
  movePoints: number
}
