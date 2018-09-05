import { IClientState } from '../models'

export function createClientState(playerId: string): IClientState {
  return {
    game: {
      map: { tiles: {} },
      activePlayerId: '',
      players: {},
      units: {},
    },
    ui: {
      highlightedTileIds: [],
      localPlayerId: playerId,
      selectedUnitId: null,
      selectedUnitSpawnTypeId: null,
      targetTileId: null,
    },
  }
}
