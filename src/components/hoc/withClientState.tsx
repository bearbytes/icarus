import * as React from 'react'
import { ClientContext } from '../../contexts/ClientContext'
import { UserAction } from '../../actions/UserActions'
import { IClientState } from '../../models'
import { pure } from './pure'

export function withClientState<S>(
  selectState: (clientState: IClientState) => S,
  render: (state: S) => React.ReactNode,
) {
  return (
    <ClientContext.Consumer>
      {ctx => pure(selectState(ctx.clientState), render)}
    </ClientContext.Consumer>
  )
}

export function withClientStateAndDispatch<S>(
  selectState: (clientState: IClientState) => S,
  render: (
    state: S & { dispatch: (action: UserAction) => void },
  ) => React.ReactNode,
) {
  return (
    <ClientContext.Consumer>
      {ctx =>
        pure(selectState(ctx.clientState), s =>
          render(Object.assign(s, { dispatch: ctx.dispatch })),
        )
      }
    </ClientContext.Consumer>
  )
}
