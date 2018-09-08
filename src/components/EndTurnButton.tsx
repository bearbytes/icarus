import React from 'react'
import { withClientStateAndDispatch } from './hoc/withClientState'
import Button from './Button'

export default function EndTurnButton() {
  return withClientStateAndDispatch(
    s => ({
      disabled: s.game.activePlayerId != s.ui.localPlayerId,
    }),
    s => (
      <Button
        text={'End Turn'}
        disabled={s.disabled}
        onClick={() => s.dispatch({ type: 'ClickOnEndTurn' })}
      />
    ),
  )
}
