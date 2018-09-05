import React from 'react'
import styled from 'styled-components'
import { withClientStateAndDispatch } from './hoc/withClientState'

export default function EndTurnButton() {
  return withClientStateAndDispatch(
    s => ({
      disabled: s.game.activePlayerId != s.ui.localPlayerId,
    }),
    s => (
      <StyledButton
        disabled={s.disabled}
        onClick={() => s.dispatch({ type: 'ClickOnEndTurn' })}
      >
        End Turn
      </StyledButton>
    ),
  )
}

const StyledButton = styled.button`
  background-color: #ddd;
  font-size: 2em;
  border: 1px solid #888;
  border-radius: 5px;
`
