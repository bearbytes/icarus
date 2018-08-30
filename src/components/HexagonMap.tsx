import * as React from 'react'
import { formatPoints, formatRect } from '../lib/svg'
import HexagonMapTile from './HexagonMapTile'
import { IHexagonMap, HexCoord, Rect } from '../types'

interface HexagonMapProps {
  map: IHexagonMap
  tileSize: number
  viewRect: Rect
}

interface StateWrapperProps<S> {
  defaultState: S
  children: (
    state: S,
    setState: (state: Pick<S, keyof S> | S) => void,
  ) => React.ReactNode
}

class StateWrapper<T> extends React.Component<StateWrapperProps<T>, T> {
  state = this.props.defaultState

  render() {
    return this.props.children(this.state, newState => this.setState(newState))
  }
}

interface ZoomableSvgProps {
  initialViewRect: Rect
  children: React.ReactNode
}

function ZoomableSvg({ initialViewRect, children }: ZoomableSvgProps) {
  return (
    <StateWrapper defaultState={initialViewRect}>
      {(viewRect, setViewRect) => (
        <svg viewBox={formatRect(viewRect)} onWheel={e => console.log(e)}>
          {children}
        </svg>
      )}
    </StateWrapper>
  )
}

export default function HexagonMap({
  map,
  viewRect,
  tileSize,
}: HexagonMapProps) {
  return (
    <ZoomableSvg initialViewRect={viewRect}>
      <defs>
        <polygon
          id={'hexagon'}
          points={formatPoints(HexCoord.corners(tileSize * 0.95))}
          strokeWidth={tileSize * 0.05}
        />
      </defs>
      {Object.keys(map.tiles).map(id => (
        <HexagonMapTile key={id} tile={map.tiles[id]} tileSize={tileSize} />
      ))}
    </ZoomableSvg>
  )
}
