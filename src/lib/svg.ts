import { map, pipe, join } from 'ramda'
import { Point } from '../types'

export const formatPoint = map((point: Point) => point.x + ',' + point.y)
export const formatPoints = pipe(
  formatPoint,
  join(' '),
)
