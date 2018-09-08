export type AnimationData = DamageAnimation

export interface DamageAnimation {
  type: 'DamageAnimation'
  tileId: string
  damage: number
}
