export function ignoreInDevTools(a: { type: string }) {
  switch (a.type) {
    case 'HoverTile':
      return true
    default:
      return false
  }
}

export type UIAction =
  | HoverTile
  | ClickOnTile
  | ClickOnUnitSpawnSelection
  | ClickOnEndTurn
  | RightClick
  | ToggleAutoEndTurn

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

export interface ToggleAutoEndTurn {
  type: 'ToggleAutoEndTurn'
}
