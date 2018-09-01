import * as React from 'react'
import { IGameState } from '../../types'
import { GameContext } from '../../contexts/GameContext'
import { UserAction } from '../../actions'

export function withGameState<S>(
  selectState: (gameState: IGameState) => S,
  render: (state: S) => React.ReactNode,
) {
  return (
    <GameContext.Consumer>
      {ctx => {
        const state = selectState(ctx.game)
        return render(state)
      }}
    </GameContext.Consumer>
  )
}

export function withSubmitAction(
  render: (submitAction: (action: UserAction) => void) => React.ReactNode,
) {
  return (
    <GameContext.Consumer>
      {ctx => {
        return render(ctx.submitAction)
      }}
    </GameContext.Consumer>
  )
}
