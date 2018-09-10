import React from 'react'
import styled from 'styled-components'
import { withDebugContext } from '../../contexts/DebugContext'
import UnitTypeEditor from './UnitTypeEditor'
import { VBox, ExpandingVBox } from '../layout'

export default function DebugEditor() {
  return withDebugContext(ctx => {
    if (!ctx.expandedEditor) return null

    return (
      <StyledDebugEditor>
        <UnitTypeEditor />
      </StyledDebugEditor>
    )
  })
}

const StyledDebugEditor = styled(VBox)`
  border: 5px solid orange;
`
