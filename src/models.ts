import { AnimationData } from './animations'

export interface IServerState {
  game: IGameState
}

export interface IClientState {
  game: IGameState
  ui: IUIState
}

export interface IGameState {
  map: IHexagonMap
  units: { [unitId: string]: IUnit }
  players: { [playerId: string]: IPlayer }

  activePlayerId: string
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
  weapon: IWeapon
}

export interface IWeapon {
  rangeCutOff: number
  rangeMax: number
  damageMin: number
  damageMax: number
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
  color: string
  unitId?: string
  blocked?: boolean
}

export interface IUIState {
  localPlayerId: string

  hoveredTileId: string | null

  tileHighlights: { [tileId: string]: IHexagonMapTileHighlight }
  pathHighlights: IPathHighlight[]

  movementPathTileIds: string[]
  attackTargetTileId: string | null

  selectedUnitId: string | null
  selectedUnitSpawnTypeId: string | null

  animations: IAnimation[]

  autoEndTurn: boolean
}

export interface IHexagonMapTileHighlight {
  borderColor?: string
  highlightColor?: string
}

export interface IPathHighlight {
  path: string[]
  color: string
}

export interface IAnimation {
  id: string
  startTime: number
  data: AnimationData
}
