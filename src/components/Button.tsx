import React from 'react'
import styled from 'styled-components'

interface ButtonProps {
  text: string
  down?: boolean
  onClick: () => void
}

export default function Button(props: ButtonProps) {
  return (
    <StyledButton down={props.down || false} onClick={props.onClick}>
      {props.text}
    </StyledButton>
  )
}

const StyledButton = styled.div<{ down: boolean }>`
  font-size: 120%;
  background-color: ${p => (p.down ? '#ccc' : '#888')};
  border: 2px transparent;
  border-radius: 8px;
  padding: 10px;
  margin: 2px;
`
