export type PlayerAction = SpawnUnit | MoveUnit | EndTurn

export interface SpawnUnit {
  type: 'SpawnUnit'
  unitTypeId: string
  tileId: string
}

export interface MoveUnit {
  type: 'MoveUnit'
  unitId: string
  tileId: string
}

export interface EndTurn {
  type: 'EndTurn'
}
