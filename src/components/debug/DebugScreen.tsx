import React from 'react'
import styled from 'styled-components'
import { withDebugContext } from '../../contexts/DebugContext'
import UnitTypeEditor from './UnitTypeEditor'
import { ExpandingVBox } from '../layout'
import MapEditor from './MapEditor'

export default function DebugScreen() {
  return withDebugContext(ctx => {
    const visible =
      ctx.visibleScreen == 'unit-editor' || ctx.visibleScreen == 'map-editor'

    if (!visible) return null

    return (
      <StyledDebugScreen>
        {ctx.visibleScreen == 'unit-editor' && <UnitTypeEditor />}
        {ctx.visibleScreen == 'map-editor' && <MapEditor />}
      </StyledDebugScreen>
    )
  })
}

const StyledDebugScreen = styled(ExpandingVBox)`
  border: 5px solid orange;
`
