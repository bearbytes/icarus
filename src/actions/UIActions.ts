export type UIAction = ClickOnTile | ClickOnUnitSpawnSelection | ClickOnEndTurn

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
