import { zipObj } from 'ramda'
import { HexCoord } from '../types'
import { IWall, IHexagonMapTile, IHexagonMap } from '../models'
import Color from 'color'

export function createMap(): IHexagonMap {
  const radius = 12
  const coordinates = new HexCoord(0, 0).area(radius)
  const tiles = zipObj(
    coordinates.map(c => c.id),
    coordinates.map(c => createHexagonMapTile(c, radius)),
  )

  // for (const tileId of createArea(Object.keys(tiles))) {
  //   tiles[tileId].color = 'white'
  // }

  // const walls = createWalls()

  return { tiles, walls: [] }
}

function createArea(tileIds: string[]): string[] {
  const maxSize = 20
  const startTileId = randomOf(tileIds)

  const result = []
  const marked = {}
  for (const tileId of tileIds) {
    marked[tileId] = false
  }

  const borderTiles = { [startTileId]: true }
  while (result.length < maxSize) {
    const tileId = randomOf(Object.keys(borderTiles))
    delete borderTiles[tileId]
    marked[tileId] = true
    result.push(tileId)
    for (const nei of HexCoord.fromId(tileId).neighbors()) {
      const neiId = nei.id
      if (marked[neiId] != false) continue
      borderTiles[neiId] = true
    }
  }
  return result
}

function createWalls(): IWall[] {
  return createWall(20, '0 0 0')
}

function createWall(length: number, startTileId: string): IWall[] {
  let index = randomInt(6)

  let leftCoord = HexCoord.fromId(startTileId)
  let rightCoord = leftCoord.neighbor(index)

  let walls: IWall[] = []

  function incrementIndex() {
    index += 1
    if (index > 5) index = 0
  }

  function decrementIndex() {
    index -= 1
    if (index < 0) index = 5
  }

  function swapIndex() {
    index = (index + 3) % 6
  }

  function turnLeft() {
    decrementIndex()
    rightCoord = leftCoord.neighbor(index)
  }

  function turnRight() {
    swapIndex()
    incrementIndex()
    leftCoord = rightCoord.neighbor(index)
    swapIndex()
  }

  function push() {
    console.log('index', index, 'left', leftCoord, 'right', rightCoord)
    walls.push({
      leftTileId: leftCoord.id,
      rightTileId: rightCoord.id,
    })
  }

  push()
  while (walls.length < length) {
    if (randomInt(2) == 0) {
      turnRight()
    } else {
      turnLeft()
    }
    push()
  }

  return walls
}

function randomInt(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive)
}

function randomOf<T>(list: T[]): T {
  return list[randomInt(list.length)]
}

function createHexagonMapTile(
  coord: HexCoord,
  radius: number,
): IHexagonMapTile {
  const r = ((coord.a / radius + 1) / 2) * 255
  const g = ((coord.b / radius + 1) / 2) * 255
  const b = ((coord.c / radius + 1) / 2) * 255
  let color = Color({ r, g, b }).toString()
  let blocked = undefined

  if (Math.random() < 0.1) {
    blocked = true
    color = 'black'
  }

  return {
    tileId: coord.id,
    color,
    blocked,
  }
}
