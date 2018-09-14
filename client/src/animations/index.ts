export type AnimationData = DamageAnimation | MissAnimation

export interface DamageAnimation {
  type: 'DamageAnimation'
  tileId: string
  damage: number
}

export interface MissAnimation {
  type: 'MissAnimation'
  tileId: string
}
