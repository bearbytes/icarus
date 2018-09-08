import React from 'react'
import { clearState } from '../lib/persistState'
import { HBox, Spacer } from './layout'
import {
  VisibleClientViewSetting,
  withDebugContext,
} from '../contexts/DebugContext'
import styled from 'styled-components'
import Button from './Button'

export default function DebugPanel() {
  return (
    <HBox>
      <ResetButton />
      <Spacer />
      <ToggleVisibileButton setting={'active'} />
      <ToggleVisibileButton setting={'inactive'} />
      <ToggleVisibileButton setting={'both'} />
    </HBox>
  )
}

function ResetButton() {
  return (
    <Button
      text={'Reset'}
      onClick={() => {
        clearState('game')
        clearState('mond')
        clearState('stern')
        location.reload()
      }}
    />
  )
}

function ToggleVisibileButton(props: { setting: VisibleClientViewSetting }) {
  return withDebugContext(ctx => (
    <Button
      text={props.setting}
      down={ctx.visibleClientView == props.setting}
      onClick={() => ctx.setVisibleClientView(props.setting)}
    />
  ))
}
