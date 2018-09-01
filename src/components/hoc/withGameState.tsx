import * as React from 'react'
import { GameContext } from '../../contexts/GameContext'
import { UserAction } from '../../actions/UserActions'
import { IGameState } from '../../models'

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

export function withDispatch(
  render: (dispatch: (action: UserAction) => void) => React.ReactNode,
) {
  return (
    <GameContext.Consumer>
      {ctx => {
        return render(ctx.dispatch)
      }}
    </GameContext.Consumer>
  )
}