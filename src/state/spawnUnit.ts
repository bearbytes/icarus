import { IGameState, IUnit } from '../types'
import { ClickOnTile } from '../actions'
import { addUnit, updateTile } from './helpers'

export function spawnUnit(s: IGameState, a: ClickOnTile): IGameState {
  const unitId = 'blablabla'
  const unit: IUnit = { unitId }
  s = addUnit(s, unit)
  s = updateTile(s, a.tileId, { unitId })
  return s
}
