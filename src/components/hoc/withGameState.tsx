import * as React from 'react'
import { GameContext } from '../../contexts/GameContext'
import { UserAction } from '../../actions/UserActions'
import { IGameState } from '../../models'
import { pure } from './pure'

export function withGameState<S>(
  selectState: (gameState: IGameState) => S,
  render: (state: S) => React.ReactNode,
) {
  return (
    <GameContext.Consumer>
      {ctx => pure(selectState(ctx.game), render)}
    </GameContext.Consumer>
  )
}

export function withDispatch(
  render: (dispatch: (action: UserAction) => void) => React.ReactNode,
) {
  return (
    <GameContext.Consumer>
      {ctx => pure(ctx.dispatch, render)}
    </GameContext.Consumer>
  )
}
