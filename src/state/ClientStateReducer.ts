import {
  GameEvent,
  GameStarted,
  UnitMoved,
  UnitSpawned,
  TurnStarted,
  UnitUpdated,
  UnitRemoved,
  AttackMissed,
} from '../actions/GameEvents'
import { IClientState, IPathHighlight, IAnimation } from '../models'
import { PlayerAction } from '../actions/PlayerActions'
import {
  ClickOnTile,
  ClickOnUnitSpawnSelection,
  UIAction,
  RightClick,
  HoverTile,
  ClickOnSkill,
} from '../actions/UIActions'
import {
  getUnitOnTile,
  getPathToTarget,
  updateTile,
  updateUnit,
  addUnit,
  getReachableTileIds,
  canAttack,
  removeUnit,
  getTileOfUnit,
  hexCoordOf,
  getHitChance,
  getHitChanceForTile,
} from './GameStateHelpers'
import {
  getSelectedUnit,
  updateUI,
  updateGame,
  isMyTurn,
  isMyUnit,
  getMovementTargetTileId,
  getMovementStartTileId,
  getRemainingMovePoints,
  getSelectedUnitId,
  addPathHighlight,
  getMyUnits,
} from './ClientStateHelpers'
import log from '../lib/log'
import { last, values, partition, all } from 'ramda'
import { HexCoord } from '../types'
import UnitTypes, { unitTypeOf } from '../resources/UnitTypes'
import { AnimationData } from '../animations'
import Color from 'color'
import { isUndefined } from 'util'

export interface IClientStateAndActions {
  nextState?: IClientState
  actions?: PlayerAction[]
  action?: PlayerAction
}

export function ClientStateReducer(
  s: IClientState,
  a: UIAction | GameEvent,
): IClientState | IClientStateAndActions {
  switch (a.type) {
    // Events
    case 'GameStarted':
      return gameStarted(s, a)
    case 'TurnStarted':
      return turnStarted(s, a)
    case 'UnitMoved':
      return unitMoved(s, a)
    case 'UnitSpawned':
      return unitSpawned(s, a)
    case 'UnitUpdated':
      return unitUpdated(s, a)
    case 'UnitRemoved':
      return unitRemoved(s, a)
    case 'AttackMissed':
      return attackMissed(s, a)

    // Actions
    case 'HoverTile':
      return hoverTile(s, a)
    case 'RightClick':
      return rightClick(s, a)
    case 'ClickOnTile':
      return clickOnTile(s, a)
    case 'ClickOnUnitSpawnSelection':
      return clickOnUnitSpawnSelection(s, a)
    case 'ClickOnEndTurn':
      return clickOnEndTurn(s)
    case 'ToggleAutoEndTurn':
      return clickOnAutoEndTurn(s)
    case 'ClickOnSkill':
      return clickOnSkill(s, a)
  }
}

function gameStarted(
  s: IClientState,
  { initialState }: GameStarted,
): IClientState {
  s = { ...s, game: initialState }
  return s
}

function turnStarted(
  s: IClientState,
  { activePlayerId }: TurnStarted,
): IClientState {
  s = updateGame(s, { activePlayerId })
  if (!isMyTurn(s)) {
    s = updateUI(s, { pathHighlights: [] })
  }
  return s
}

function unitMoved(s: IClientState, { unitId, path }: UnitMoved): IClientState {
  const unit = s.game.units[unitId]

  const tileId = last(path)!

  s = updateGame(s, g => {
    g = updateTile(g, unit.tileId, { unitId: undefined })
    g = updateTile(g, tileId, { unitId })
    g = updateUnit(g, unitId, { tileId })
    return g
  })

  if (unit.playerId != s.ui.localPlayerId) {
    s = addPathHighlight(s, { path, color: '#f883' })
  }

  s = updateTileHighlights(s)

  return s
}

function unitSpawned(s: IClientState, { unit }: UnitSpawned): IClientState {
  s = updateGame(s, g => {
    g = addUnit(g, unit)
    g = updateTile(g, unit.tileId, { unitId: unit.unitId })
    return g
  })

  s = updateTileHighlights(s)

  return s
}

function unitUpdated(
  s: IClientState,
  { unitId, actionPoints, movePoints, hitPoints }: UnitUpdated,
): IClientStateAndActions {
  if (hitPoints != null) {
    const unit = s.game.units[unitId]
    const hitPointsBefore = unit.hitPoints
    const damage = hitPointsBefore - hitPoints
    if (damage > 0) {
      s = addAnimation(s, {
        type: 'DamageAnimation',
        damage,
        tileId: unit.tileId,
      })
    }
  }

  s = updateGame(s, g => {
    g = updateUnit(g, unitId, unit => {
      return {
        actionPoints: actionPoints != null ? actionPoints : unit.actionPoints,
        movePoints: movePoints != null ? movePoints : unit.movePoints,
        hitPoints: hitPoints != null ? hitPoints : unit.hitPoints,
      }
    })
    return g
  })

  if (unitId == getSelectedUnitId(s)) {
    s = updateTileHighlights(s)
  }

  // check if we should end turn
  if (s.ui.autoEndTurn && isMyTurn(s) && isMyUnit(s, unitId)) {
    const units = getMyUnits(s)
    if (units.length > 0) {
      if (all(unit => unit.actionPoints == 0, units)) {
        return {
          nextState: s,
          action: { type: 'EndTurn' },
        }
      }
    }
  }

  return { nextState: s }
}

function unitRemoved(s: IClientState, { unitId }: UnitRemoved): IClientState {
  s = updateGame(s, g => removeUnit(g, unitId))
  s = updateTileHighlights(s)
  return s
}

function attackMissed(
  s: IClientState,
  { defenderUnitId }: AttackMissed,
): IClientState {
  const tile = getTileOfUnit(s.game, defenderUnitId)
  s = addAnimation(s, { type: 'MissAnimation', tileId: tile.tileId })
  return s
}

function hoverTile(s: IClientState, { tileId }: HoverTile): IClientState {
  s = updateUI(s, { hoveredTileId: tileId })
  return s
}

function rightClick(s: IClientState, a: RightClick): IClientState {
  if (s.ui.selectedSkillId) {
    s = updateUI(s, { selectedSkillId: null })
  } else if (s.ui.attackTargetTileId) {
    s = updateUI(s, { attackTargetTileId: null })
  } else if (s.ui.movementPathTileIds.length > 0) {
    s = updateUI(s, { movementPathTileIds: [] })
  } else if (s.ui.selectedUnitId) {
    s = updateUI(s, { selectedUnitId: null })
  }

  s = updateTileHighlights(s)
  return s
}

function clickOnTile(
  s: IClientState,
  { tileId }: ClickOnTile,
): IClientStateAndActions {
  const selectedUnit = getSelectedUnit(s)
  const unitOnTile = getUnitOnTile(s.game, tileId)

  if (canAttackTile()) {
    return attackTile()
  }
  if (canSelectUnitOnTile()) {
    return selectUnitOnTile()
  }
  if (canSpawnUnitOnTile()) {
    return spawnUnitOnTile()
  }
  if (canMoveUnitToTile()) {
    return moveUnitToTile()
  }
  return { nextState: s }

  function canAttackTile() {
    return (
      selectedUnit &&
      unitOnTile &&
      s.ui.selectedSkillId &&
      canAttack(
        s.game,
        selectedUnit.unitId,
        unitOnTile.unitId,
        s.ui.localPlayerId,
      )
    )
  }

  function attackTile(): IClientStateAndActions {
    if (isMarkedAsTarget()) {
      return executeAttack()
    } else {
      return markAsTarget()
    }

    function isMarkedAsTarget() {
      return tileId == s.ui.attackTargetTileId
    }

    function markAsTarget(): IClientStateAndActions {
      s = updateUI(s, { attackTargetTileId: tileId })
      s = updateTileHighlights(s)
      return {
        nextState: s,
      }
    }

    function executeAttack(): IClientStateAndActions {
      s = updateUI(s, { attackTargetTileId: null, selectedSkillId: null })
      s = updateTileHighlights(s)
      return {
        nextState: s,
        action: {
          type: 'AttackUnit',
          attackingUnitId: selectedUnit!.unitId,
          defenderUnitId: unitOnTile!.unitId,
        },
      }
    }
  }

  function canSelectUnitOnTile() {
    return unitOnTile && unitOnTile.playerId == s.ui.localPlayerId
  }

  function selectUnitOnTile(): IClientStateAndActions {
    s = selectUnit(s, unitOnTile!.unitId)
    s = updateUI(s, { attackTargetTileId: null })
    s = updateTileHighlights(s)
    return { nextState: s }
  }

  function canSpawnUnitOnTile() {
    return isMyTurn(s) && s.ui.selectedUnitSpawnTypeId
  }

  function spawnUnitOnTile(): IClientStateAndActions {
    return {
      nextState: s,
      action: {
        type: 'SpawnUnit',
        tileId,
        unitTypeId: s.ui.selectedUnitSpawnTypeId!,
      },
    }
  }

  function canMoveUnitToTile() {
    return selectedUnit != null && isMyTurn(s) && s.ui.selectedSkillId == null
  }

  function moveUnitToTile(): IClientStateAndActions {
    if (getMovementTargetTileId(s) == tileId) {
      return moveUnit(s)
    } else {
      s = createMovementPathToTile(s, tileId)
      return { nextState: s }
    }
  }
}

function clickOnUnitSpawnSelection(
  s: IClientState,
  { unitTypeId }: ClickOnUnitSpawnSelection,
): IClientState {
  s = deselectUnit(s)

  const alreadySelected = s.ui.selectedUnitSpawnTypeId === unitTypeId
  const selectedUnitSpawnTypeId = alreadySelected ? null : unitTypeId

  return updateUI(s, { selectedUnitSpawnTypeId })
}

function clickOnEndTurn(s: IClientState): IClientStateAndActions {
  if (!isMyTurn(s)) {
    return {}
  }

  s = deselectUnit(s)

  return {
    nextState: s,
    action: { type: 'EndTurn' },
  }
}

function clickOnAutoEndTurn(s: IClientState): IClientState {
  return updateUI(s, { autoEndTurn: !s.ui.autoEndTurn })
}

function clickOnSkill(
  s: IClientState,
  { skillId }: ClickOnSkill,
): IClientState {
  s = updateUI(s, { selectedSkillId: skillId })
  s = updateTileHighlights(s)
  return s
}

function selectUnit(s: IClientState, unitId: string): IClientState {
  s = updateUI(s, {
    selectedUnitId: unitId,
    selectedUnitSpawnTypeId: null,
    selectedSkillId: null,
  })
  s = updateTileHighlights(s)
  return s
}

function deselectUnit(s: IClientState): IClientState {
  const unit = getSelectedUnit(s)
  if (!unit) return s
  return updateUI(s, {
    selectedUnitId: null,
    tileHighlights: {},
    movementPathTileIds: [],
  })
}

function moveUnit(s: IClientState): IClientStateAndActions {
  const unit = getSelectedUnit(s)
  if (!unit) return { nextState: s }

  const path = s.ui.movementPathTileIds
  s = updateUI(s, { movementPathTileIds: [] })

  return {
    nextState: s,
    action: {
      type: 'MoveUnit',
      unitId: unit.unitId,
      path,
    },
  }
}

function createMovementPathToTile(
  s: IClientState,
  targetTileId: string,
): IClientState {
  const targetTile = s.game.map.tiles[targetTileId]
  if (targetTile.blocked) return s

  const movePoints = getRemainingMovePoints(s)
  if (!movePoints) return s

  const startTileId = getMovementStartTileId(s)
  if (!startTileId) return s

  const path = getPathToTarget(s.game, startTileId, targetTileId) || []
  if (movePoints < path.length) return s

  const movementPathTileIds = [
    ...s.ui.movementPathTileIds,
    ...path.map(tile => tile.tileId),
  ]
  s = updateUI(s, { movementPathTileIds })
  s = updateTileHighlights(s)
  return s
}

function updateTileHighlights(s: IClientState): IClientState {
  const selectedUnit = getSelectedUnit(s)

  const tileHighlights = {}

  if (s.ui.selectedSkillId == null) {
    // no skill selected: show tiles where we can move to
    const startTileId = getMovementStartTileId(s)
    if (startTileId) {
      const range = getRemainingMovePoints(s)
      if (range) {
        for (const tileId of getReachableTileIds(s.game, startTileId, range)) {
          tileHighlights[tileId] = {
            highlightColor: '#fff2',
          }
        }
      }
    }
  } else {
    // skill selected (assume attack): show tiles where we can attack
    if (selectedUnit) {
      const range = unitTypeOf(selectedUnit).weapon.rangeMax
      const unitTile = getTileOfUnit(s.game, selectedUnit)
      for (const coord of hexCoordOf(unitTile).area(range)) {
        const tileId = coord.id
        const tile = s.game.map.tiles[tileId]
        if (!tile || tile.blocked) continue
        const hitChance = getHitChanceForTile(s.game, selectedUnit, tileId)
        tileHighlights[tileId] = {
          highlightColor: Color('white').alpha(hitChance),
        }
      }
    }
  }

  // // tiles with units that we can attack
  // const [myUnits, enemyUnits] = partition(
  //   unit => unit.playerId == s.ui.localPlayerId,
  //   values(s.game.units),
  // )

  // for (const myUnit of myUnits) {
  //   const myCoord = HexCoord.fromId(myUnit.tileId)
  //   const range = UnitTypes[myUnit.unitTypeId].weapon.rangeMax

  //   for (const enemyUnit of enemyUnits) {
  //     const theirCoord = HexCoord.fromId(enemyUnit.tileId)
  //     const dist = myCoord.distance(theirCoord)
  //     if (dist > range) continue

  //     const isAttackTargetTile = enemyUnit.tileId == s.ui.attackTargetTileId
  //     tileHighlights[enemyUnit.tileId] = {
  //       highlightColor: '#f005',
  //       borderColor: isAttackTargetTile && '#f00',
  //     }
  //   }
  // }

  if (selectedUnit) {
    tileHighlights[selectedUnit.tileId] = {
      borderColor: '#fff',
      highlightColor: '#fff8',
    }
  }

  if (s.ui.attackTargetTileId) {
    tileHighlights[s.ui.attackTargetTileId] = {
      highlightColor: '#f005',
    }
  }

  return updateUI(s, { tileHighlights })
}

function addAnimation(s: IClientState, data: AnimationData): IClientState {
  const startTime = new Date().getTime()
  const index = s.ui.animations.length
  const id = startTime + ':' + index

  const animation: IAnimation = { id, startTime, data }

  const now = new Date().getTime()
  const expireBefore = now - 10000 // no animation should be longer than 10 seconds.. :o
  let animations = s.ui.animations.filter(a => a.startTime > expireBefore)
  animations = [...animations, animation]

  s = updateUI(s, { animations })
  return s
}
