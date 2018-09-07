export type PlayerAction = SpawnUnit | MoveUnit | AttackUnit | EndTurn

export interface SpawnUnit {
  type: 'SpawnUnit'
  unitTypeId: string
  tileId: string
}

export interface MoveUnit {
  type: 'MoveUnit'
  unitId: string
  path: string[]
}

export interface AttackUnit {
  type: 'AttackUnit'
  attackingUnitId: string
  attackedUnitId: string
}

export interface EndTurn {
  type: 'EndTurn'
}
