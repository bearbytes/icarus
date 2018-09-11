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
      localPlayerId: playerId,
      selectedUnitId: null,
      selectedUnitSpawnTypeId: null,
      tileHighlights: {},
      pathHighlights: [],
      movementPathTileIds: [],
      hoveredTileId: null,
      attackTargetTileId: null,
      animations: [],
      autoEndTurn: true,
      selectedSkillId: null,
    },
  }
}
