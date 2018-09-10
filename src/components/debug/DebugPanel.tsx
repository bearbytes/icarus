import React from 'react'
import { HBox, Spacer } from '../layout'
import {
  VisibleClientViewSetting,
  withDebugContext,
} from '../../contexts/DebugContext'
import styled from 'styled-components'
import Button from '../ui/Button'
import { clearCacheAndReload } from './ErrorBoundary'

export default function DebugPanel() {
  return (
    <StyledDebugPanel>
      <ResetButton />
      <ToggleButton />
      <Spacer />
      <ToggleVisibileButton setting={'active'} />
      <ToggleVisibileButton setting={'inactive'} />
      <ToggleVisibileButton setting={'both'} />
    </StyledDebugPanel>
  )
}

function ResetButton() {
  return <Button text={'Reset'} onClick={clearCacheAndReload} />
}

function ToggleButton() {
  return withDebugContext(ctx => (
    <Button text={'Toggle Editor'} onClick={ctx.toggleEditor} />
  ))
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

const StyledDebugPanel = styled(HBox)`
  margin-top: auto;
  border: 5px solid orange;
`
