import React from 'react'
import styled from 'styled-components'
import { withDebugContext } from '../../contexts/DebugContext'
import UnitTypeEditor from './UnitTypeEditor'
import { VBox, ExpandingVBox } from '../layout'

export default function DebugScreen() {
  return withDebugContext(ctx => {
    if (ctx.visibleScreen != 'unit-editor') return null

    return (
      <StyledDebugScreen>
        <UnitTypeEditor />
      </StyledDebugScreen>
    )
  })
}

const StyledDebugScreen = styled(ExpandingVBox)`
  border: 5px solid orange;
`
