import React from 'react'
import styled from 'styled-components'

export default function TextInput({
  text,
  setText,
  placeholder,
}: {
  text: string
  setText: (text: string) => void
  placeholder: string
}) {
  return (
    <StyledInput
      value={text}
      onChange={e => setText(e.currentTarget.value)}
      placeholder={placeholder}
    />
  )
}

const StyledInput = styled.input`
  flex: 1;

  background-color: #888;
  font-size: 1.2em;

  border: 2px transparent;
  border-radius: 8px;
  padding: 10px;
  margin: 2px;
  justify-content: center;
  align-items: center;

  :hover {
    background-color: #ccc;
  }
`
