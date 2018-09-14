declare module 'a-star' {
  export = aStar
  function aStar<T>(options: Options<T>): Result<T>

  interface Options<T> {
    start: T
    isEnd(node: T): boolean
    neighbor(node: T): T[]
    distance(from: T, to: T): number
    heuristic(node: T): number
    hash?(node: T): string
    timout?: number
  }

  interface Result<T> {
    status: 'success' | 'noPath' | 'timeout'
    path: T[]
  }
}
