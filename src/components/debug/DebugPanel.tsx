import React from 'react'
import { HBox, Spacer } from '../layout'
import { Screen, withDebugContext } from '../../contexts/DebugContext'
import styled from 'styled-components'
import Button from '../ui/Button'
import { clearCacheAndReload } from './ErrorBoundary'

export default function DebugPanel() {
  return (
    <StyledDebugPanel>
      <ResetButton />
      <Spacer />
      <ToggleVisibileButton screen={'unit-editor'} />
      <ToggleVisibileButton screen={'map-editor'} />
      <Spacer />
      <ToggleVisibileButton screen={'active'} />
      <ToggleVisibileButton screen={'inactive'} />
      <ToggleVisibileButton screen={'side-by-side'} />
    </StyledDebugPanel>
  )
}

function ResetButton() {
  return <Button text={'Reset'} onClick={clearCacheAndReload} />
}

function ToggleVisibileButton(props: { screen: Screen }) {
  return withDebugContext(ctx => (
    <Button
      text={props.screen}
      down={ctx.visibleScreen == props.screen}
      onClick={() => ctx.setVisibleScreen(props.screen)}
    />
  ))
}

const StyledDebugPanel = styled(HBox)`
  margin-top: auto;
  border: 5px solid orange;
`
