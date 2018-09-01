import { ClickOnTile } from '../actions/UserActions'
import { addUnit, updateTile } from './helpers'
import { createId } from '../lib/createId'
import { IGameState, IUnit } from '../models'

export function spawnUnit(s: IGameState, a: ClickOnTile): IGameState {
  const unitId = createId('unit')
  const unit: IUnit = { unitId }
  s = addUnit(s, unit)
  s = updateTile(s, a.tileId, { unitId })
  return s
}
