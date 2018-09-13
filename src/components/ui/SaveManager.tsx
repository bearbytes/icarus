import React from 'react'
import styled from 'styled-components'
import { withState, withStickyState } from '../hoc/withState'
import { VBox, CenteredHBox } from '../layout'
import TextInput from './TextInput'
import { Save } from 'styled-icons/fa-solid/Save'
import Button from './Button'
import { Delete } from 'styled-icons/material/Delete'

interface SaveManagerProps<T> {
  saveItem: T
  persistKey: string
  onLoad: (item: T) => void
}

export default function SaveManager<T>({
  saveItem,
  persistKey,
  onLoad,
}: SaveManagerProps<T>) {
  return withStickyState<{ [name: string]: T | null }>(
    persistKey,
    {},
    (state, setState) => {
      const names = Object.keys(state).filter(name => state[name] !== null)

      function onSave(name: string) {
        setState({ [name]: saveItem })
      }

      function onDelete(name: string) {
        setState({ [name]: null })
      }

      function onLoadName(name: string) {
        onLoad(state[name]!)
      }

      return (
        <StyledSaveManager>
          <NewSaveEntry onSave={onSave} />
          {names.map(name => (
            <Entry
              key={name}
              name={name}
              onClick={() => onLoadName(name)}
              onDelete={() => onDelete(name)}
            />
          ))}
        </StyledSaveManager>
      )
    },
  )
}

function NewSaveEntry({ onSave }: { onSave: (name: string) => void }) {
  return withState({ name: '' }, (state, setState) => (
    <CenteredHBox>
      <TextInput
        text={state.name}
        setText={name => setState({ name })}
        placeholder={'Enter save name...'}
      />
      <StyledSaveIcon size={35} onClick={() => onSave(state.name)} />
    </CenteredHBox>
  ))
}

function Entry({
  name,
  onClick,
  onDelete,
}: {
  name: string
  onClick: () => void
  onDelete: () => void
}) {
  return (
    <CenteredHBox>
      <Button
        style={{ flex: 1, justifyContent: 'left' }}
        text={name}
        onClick={onClick}
      />
      <StyledDeleteIcon size={35} onClick={onDelete} />
    </CenteredHBox>
  )
}

const StyledSaveIcon = styled(Save)`
  color: #888;
  :hover {
    color: #ccc;
  }
`

const StyledDeleteIcon = styled(Delete)`
  color: #888;
  :hover {
    color: #ccc;
  }
`

const StyledSaveManager = styled(VBox)`
  border: 2px solid #888;
  border-radius: 8px;
  padding: 5px;
`
