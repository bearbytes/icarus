import * as React from 'react'
import UnitSpawnSelectionArea from './UnitSpawnSelectionArea'
import { HBox, Spacer } from './layout'
import EndTurnButton from './EndTurnButton'

export default function ControlPanel() {
  return (
    <HBox>
      <UnitSpawnSelectionArea />
      <Spacer />
      <EndTurnButton />
    </HBox>
  )
}
