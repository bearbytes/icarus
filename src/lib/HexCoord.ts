import { Point } from '../types'
import { times } from 'ramda'

export class HexCoord {
  readonly a: number
  readonly b: number

  static Zero = new HexCoord(0, 0)

  constructor(a: number, b: number) {
    this.a = a
    this.b = b
  }

  static fromId(id: string): HexCoord {
    const [a, b] = id.split(' ')
    return new HexCoord(parseInt(a), parseInt(b))
  }

  get c(): number {
    return -this.a - this.b
  }

  get id(): string {
    return `${this.a} ${this.b} ${this.c}`
  }

  equals(other: HexCoord): boolean {
    return this.a === other.a && this.b === other.b
  }

  distance(other: HexCoord): number {
    return (
      0.5 *
      (Math.abs(this.a - other.a) +
        Math.abs(this.b - other.b) +
        Math.abs(this.c - other.c))
    )
  }

  add(other: HexCoord): HexCoord {
    return new HexCoord(this.a + other.a, this.b + other.b)
  }

  round(): HexCoord {
    return new HexCoord(Math.round(this.a), Math.round(this.b))
  }

  neighbors(): HexCoord[] {
    return [
      new HexCoord(this.a + 1, this.b),
      new HexCoord(this.a + 1, this.b - 1),
      new HexCoord(this.a, this.b - 1),
      new HexCoord(this.a - 1, this.b),
      new HexCoord(this.a - 1, this.b + 1),
      new HexCoord(this.a, this.b + 1),
    ]
  }

  area(radius: number): HexCoord[] {
    const results: HexCoord[] = []
    for (let da = -radius; da <= radius; da++) {
      const lower = Math.max(-radius, -da - radius)
      const upper = Math.min(radius, -da + radius)
      for (let db = lower; db <= upper; db++) {
        results.push(new HexCoord(this.a + da, this.b + db))
      }
    }
    return results
  }

  static corner(index: number, radius: number = 1.0): Point {
    const a = ((Math.PI * 2) / 6) * index
    return {
      x: Math.cos(a) * radius,
      y: Math.sin(a) * radius,
    }
  }

  static corners(radius: number = 1.0): Point[] {
    return times(n => HexCoord.corner(n, radius), 6)
  }

  toPixel(radius: number = 1.0): Point {
    return {
      x: 1.5 * this.a * radius,
      y: Math.sqrt(3) * (this.b + this.a / 2) * radius,
    }
  }

  static fromPixel(point: Point): HexCoord {
    const a = (point.x * 2) / 3
    const b = (-point.x + Math.sqrt(3) * point.y) / 3
    return new HexCoord(a, b)
  }
}
