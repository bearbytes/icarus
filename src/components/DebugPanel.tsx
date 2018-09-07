import React from 'react'
import { clearState } from '../lib/persistState'

export default function DebugPanel() {
  return <ResetButton />
}

function ResetButton() {
  return <button onClick={reset}>Reset</button>

  function reset() {
    clearState('game')
    clearState('mond')
    clearState('stern')
    location.reload()
  }
}
