import { HexCoord } from './types'

export interface IGameState {
  map: IHexagonMap
  units: { [unitId: string]: IUnit }
  players: { [playerId: string]: IPlayer }

  activePlayerId: string
}

export interface IUIState {
  localPlayerId: string

  hoveredTileId: string | null

  tileHighlights: { [tileId: string]: IHexagonMapTileHighlight }
  pathHighlights: IPathHighlight[]

  movementPathTileIds: string[]

  selectedUnitId: string | null
  selectedUnitSpawnTypeId: string | null
}

export interface IClientState {
  game: IGameState
  ui: IUIState
}

export interface IServerState {
  game: IGameState
}

export interface IPlayer {
  playerId: string
  name: string
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

export interface IHexagonMapTileHighlight {
  borderColor: string
}

export interface IPathHighlight {
  path: string[]
  color: string
}

export interface IUnit {
  unitId: string
  unitTypeId: string
  playerId: string
  tileId: string

  actionPoints: number
  movePoints: number
  hitPoints: number
}

export interface IUnitType {
  unitTypeId: string
  svgPath: string

  movePoints: number
  hitPoints: number
  attackRange: number
  attackDamage: number
}
