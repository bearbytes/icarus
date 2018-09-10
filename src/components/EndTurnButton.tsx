import React from 'react'
import { withClientStateAndDispatch } from './hoc/withClientState'
import Button from './ui/Button'
import { VBox } from './layout'
import Checkbox from './ui/StyledCheckbox'

export default function EndTurnButton() {
  return withClientStateAndDispatch(
    s => ({
      autoEndTurn: s.ui.autoEndTurn,
      disabled: s.game.activePlayerId != s.ui.localPlayerId,
    }),
    s => (
      <VBox>
        <Checkbox
          text={'End turn automatically'}
          value={s.autoEndTurn}
          onToggle={() => s.dispatch({ type: 'ToggleAutoEndTurn' })}
        />
        <Button
          text={'End Turn'}
          disabled={s.disabled}
          onClick={() => s.dispatch({ type: 'ClickOnEndTurn' })}
        />
      </VBox>
    ),
  )
}
