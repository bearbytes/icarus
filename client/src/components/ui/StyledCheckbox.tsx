import React from 'react'
import styled from 'styled-components'
import { CheckSquare, Square } from 'styled-icons/fa-regular'
import { HBox } from '../layout'

export default function Checkbox(props: {
  value: boolean
  onToggle: (newValue: boolean) => void
  text: string
}) {
  const Icon = props.value ? CheckSquare : Square

  return (
    <StyledCheckbox>
      <Icon
        size={30}
        onClick={() => props.onToggle(!props.value)}
        style={{ marginRight: '5px' }}
      />
      {props.text}
    </StyledCheckbox>
  )
}

const StyledCheckbox = styled(HBox)`
  color: white;
  align-items: center;
  margin: auto;
`
