import { map, pipe, join } from 'ramda'
import { Point, Rect } from '../types'

export const formatPoint = map((point: Point) => point.x + ',' + point.y)
export const formatPoints = pipe(
  formatPoint,
  join(' '),
)

export function formatRect(rect: Rect): string {
  return `${rect.topLeft.x} ${rect.topLeft.y} ${rect.size.w} ${rect.size.h}`
}
