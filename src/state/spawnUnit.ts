import { IGameState, IUnit } from '../types'
import { ClickOnTile } from '../actions'
import { addUnit, updateTile } from './helpers'
import { createId } from '../lib/createId'

export function spawnUnit(s: IGameState, a: ClickOnTile): IGameState {
  const unitId = createId('unit')
  const unit: IUnit = { unitId }
  s = addUnit(s, unit)
  s = updateTile(s, a.tileId, { unitId })
  return s
}
