export type UIAction =
  | ClickOnTile
  | ClickOnUnitSpawnSelection
  | ClickOnEndTurn
  | RightClick

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
