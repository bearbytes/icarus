import * as React from 'react'
import styled from 'styled-components'
import UnitSpawnSelectionArea from './UnitSpawnSelectionArea'

export default function ControlPanel() {
  return (
    <StyledControlPanel>
      <UnitSpawnSelectionArea />
    </StyledControlPanel>
  )
}

const StyledControlPanel = styled.div``
