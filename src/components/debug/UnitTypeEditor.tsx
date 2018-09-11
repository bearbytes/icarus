import React from 'react'
import ReactJson, { InteractionProps } from 'react-json-view'
import UnitTypes, {
  updateUnitTypes,
  DefaultUnitTypes,
} from '../../resources/UnitTypes'
import { contains, assocPath } from 'ramda'
import { VBox } from '../layout'
import Button from '../ui/Button'
import { withState } from '../hoc/withState'

export default function UnitTypeEditor() {
  return withState(DefaultUnitTypes, (state, setState) => (
    <VBox>
      <Button
        text={'Reset Unit Types'}
        onClick={() => {
          updateUnitTypes(DefaultUnitTypes)
          setState(DefaultUnitTypes)
        }}
      />
      <ReactJson
        name="UnitTypes"
        src={state}
        theme={'threezerotwofour'}
        collapsed={2}
        collapseStringsAfterLength={25}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        onEdit={onEdit}
      />
    </VBox>
  ))
}

function onEdit(props: InteractionProps) {
  const editableFields = [
    'movePoints',
    'hitPoints',
    'attackRangeCutOff',
    'attackRangeMax',
    'attackDamage',
  ]
  if (!contains(props.name, editableFields)) return false

  const path = props.namespace.map(x => x as string)
  path.push(props.name!)

  updateUnitTypes(assocPath(path, props.new_value, UnitTypes))

  return true
}
