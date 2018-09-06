export type UIAction =
  | HoverTile
  | ClickOnTile
  | ClickOnUnitSpawnSelection
  | ClickOnEndTurn
  | RightClick

export interface HoverTile {
  type: 'HoverTile'
  tileId: string
}

export interface ClickOnTile {
  type: 'ClickOnTile'
  tileId: string
}

export interface ClickOnUnitSpawnSelection {
  type: 'ClickOnUnitSpawnSelection'
  unitTypeId: string
}

export interface ClickOnEndTurn {
  type: 'ClickOnEndTurn'
}

export interface RightClick {
  type: 'RightClick'
}
