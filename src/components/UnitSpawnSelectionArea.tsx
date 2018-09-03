import * as React from 'react'
import styled from 'styled-components'

export default function UnitSpawnSelectionArea() {
  return (
    <StyledUnitSpawnSelectionArea>
      <UnitSpawnSelection />
    </StyledUnitSpawnSelectionArea>
  )
}

const StyledUnitSpawnSelectionArea = styled.div`
  background-color: gray;
  width: 300px;
  height: 200px;
  padding: 5px;
`

function UnitSpawnSelection() {
  return (
    <StyledUnitSpawnSelection>
      <svg viewBox="-50 -50 100 100">
        <image
          xlinkHref={'https://image.flaticon.com/icons/svg/443/443955.svg'}
          x={-50}
          y={-50}
          width={100}
          height={100}
        />
      </svg>
    </StyledUnitSpawnSelection>
  )
}

const StyledUnitSpawnSelection = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid white;
`
