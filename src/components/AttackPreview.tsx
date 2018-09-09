import React from 'react'
import { withClientState } from './hoc/withClientState'
import { getSelectedUnit } from '../state/ClientStateHelpers'
import styled from 'styled-components'
import { IUnit } from '../models'
import { getUnitOnTile } from '../state/GameStateHelpers'
import { HBox, VBox, CenteredHBox } from './layout'
import UnitTypes from '../resources/UnitTypes'
import { Crosshairs, StyledIcon } from 'styled-icons/fa-solid/Crosshairs'
import { Gavel } from 'styled-icons/fa-solid/Gavel'

export default function AttackPreview() {
  return withClientState(
    s => {
      let myUnit = getSelectedUnit(s)
      if (myUnit && myUnit.playerId != s.ui.localPlayerId) {
        myUnit = null
      }

      let enemyUnit =
        getUnitOnTile(s.game, s.ui.attackTargetTileId) ||
        getUnitOnTile(s.game, s.ui.hoveredTileId)
      if (enemyUnit && enemyUnit.playerId == s.ui.localPlayerId) {
        enemyUnit = null
      }

      return {
        myUnit,
        enemyUnit,
      }
    },
    s => (
      <StyledAttackPreview>
        <UnitPreview unit={s.myUnit} />
        <CenteredHBox>
          <AttackText attackerUnit={s.myUnit} attackedUnit={s.enemyUnit} />
        </CenteredHBox>
        <UnitPreview unit={s.enemyUnit} />
      </StyledAttackPreview>
    ),
  )
}

function AttackText(props: {
  attackerUnit: IUnit | null
  attackedUnit: IUnit | null
}) {
  const { attackerUnit, attackedUnit } = props
  if (!attackerUnit || !attackedUnit) return null

  return (
    <VBox>
      {Row(Crosshairs, '73%')}
      {Row(Gavel, '2-4')}
    </VBox>
  )

  function Row(Icon: StyledIcon<any>, text: string) {
    return (
      <CenteredHBox>
        <Icon size={25} style={{ margin: '5px' }} />
        <div>{text}</div>
      </CenteredHBox>
    )
  }
}

function UnitPreview(props: { unit: IUnit | null }) {
  const { unit } = props

  if (!unit) return <StyledUnitPreview />

  return withClientState(
    s => ({
      color: s.game.players[unit.playerId].color,
    }),
    s => (
      <StyledUnitPreview>
        <svg viewBox="0 0 512 512">
          <path
            d={UnitTypes[unit.unitTypeId].svgPath}
            fill={'white'}
            stroke={s.color}
            strokeWidth={10}
          />
        </svg>
        {unit.unitTypeId}
      </StyledUnitPreview>
    ),
  )
}

const StyledAttackPreview = styled(HBox)`
  width: 300px;
  height: 100px;
  padding: 10px;
  margin: 10px;
  border: 3px solid white;
  border-radius: 20px;
  color: white;
`

const StyledUnitPreview = styled(VBox)`
  width: 100px;
  align-items: center;
`
