import React from 'react'
import SvgViewer from '../map/SvgViewer'
import Tile from '../map/Tile'
import { VBox, ExpandingHBox, Spacer } from '../layout'
import { SliderPicker, ColorResult, CirclePicker } from 'react-color'
import styled from 'styled-components'
import { IHexagonMap, IHexagonMapTile } from '../../models'
import { createMap } from '../../lib/MapCreator'
import { withState } from '../hoc/withState'
import { assocPath } from 'ramda'
import Button from '../ui/Button'
import { saveAs } from 'file-saver'

interface MapEditorState {
  color: string
  mode: EditMode
  map: IHexagonMap
}

type EditMode = 'colored-tile' | 'blocked-tile'

function createEmptyMap(): IHexagonMap {
  return createMap()
}

export default function MapEditor() {
  const defaultState: MapEditorState = {
    color: '#F44336',
    mode: 'colored-tile',
    map: createEmptyMap(),
  }

  return withState(defaultState, (state, setState) => {
    function onSweepTile(tileId: string) {
      if (state.mode == 'colored-tile') {
        updateTile(tileId, { color: state.color, blocked: false })
      } else {
        updateTile(tileId, { color: 'black', blocked: true })
      }
    }

    function updateTile(tileId: string, partial: Partial<IHexagonMapTile>) {
      const tile = { ...state.map.tiles[tileId], ...partial }
      const tiles = { ...state.map.tiles, [tileId]: tile }
      const map = { ...state.map, tiles }
      setState({ map })
    }

    function setColor(result: ColorResult) {
      setState({ color: result.hex })
    }

    function downloadMap() {
      const fileContent = JSON.stringify(state.map)
      const blob = new Blob([fileContent], { type: 'text/json;charset=utf-8' })
      saveAs(blob, 'map.json')
    }

    function ModeButton({ mode }: { mode: EditMode }) {
      return (
        <Button
          text={mode}
          down={state.mode == mode}
          onClick={() => setState({ mode })}
        />
      )
    }

    return (
      <ExpandingHBox>
        <StyledLeftSide>
          <StyledColorContainer>
            <CirclePicker color={state.color} onChangeComplete={setColor} />
          </StyledColorContainer>
          <ModeButton mode={'colored-tile'} />
          <ModeButton mode={'blocked-tile'} />
          <Spacer />
          <Button text={'Download'} onClick={downloadMap} />
        </StyledLeftSide>
        <Map map={state.map} onSweepTile={onSweepTile} />
      </ExpandingHBox>
    )
  })
}

const StyledColorContainer = styled.div`
  margin: 10px;
`

const StyledLeftSide = styled(VBox)`
  padding: 10px;
`

function Map(props: {
  map: IHexagonMap
  onSweepTile: (tileId: string) => void
}) {
  return (
    <SvgViewer
      center={{ x: 0, y: 0 }}
      size={40}
      scrollSpeed={0.01}
      zoomFactor={1.2}
      zoomInSteps={4}
      zoomOutSteps={4}
      onRightClick={() => {}}
    >
      {Object.keys(props.map.tiles).map(tileId => (
        <Tile
          key={tileId}
          tileId={tileId}
          fillColor={props.map.tiles[tileId].color}
          strokeColor={props.map.tiles[tileId].color}
          onSweep={() => props.onSweepTile(tileId)}
        />
      ))}
    </SvgViewer>
  )
}
