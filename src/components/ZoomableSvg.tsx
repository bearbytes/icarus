import * as React from 'react'
import { Rect, Point } from '../types'
import StateWrapper from './StateWrapper'
import { formatRect } from '../lib/svg'

interface ZoomableSvgProps {
  initialViewRect: Rect
  children: React.ReactNode
}

export default function ZoomableSvg({
  initialViewRect,
  children,
}: ZoomableSvgProps) {
  return (
    <StateWrapper
      defaultState={{
        viewRect: initialViewRect,
        lastScreenPos: null as Point | null,
      }}
    >
      {(state, setState) => {
        function onWheel(e: React.WheelEvent<SVGSVGElement>) {
          e.preventDefault()
          const worldPos = worldPosFromEvent(e)
          const zoomFactor = e.deltaY > 0 ? 1.2 : 1 / 1.2
          const viewRect = zoomedViewRect(state.viewRect, worldPos, zoomFactor)
          setState({ viewRect })
        }

        function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
          const lastScreenPos = screenPosFromEvent(e)
          setState({ lastScreenPos })
        }

        function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
          const { lastScreenPos } = state
          if (!lastScreenPos) return

          const screenPos = screenPosFromEvent(e)
          const svg = e.currentTarget

          const viewRect = draggedViewRect(
            state.viewRect,
            worldPosFromScreenPos(svg, lastScreenPos),
            worldPosFromScreenPos(svg, screenPos),
          )

          setState({ viewRect, lastScreenPos: screenPos })
        }

        function onMouseUp(e: React.MouseEvent<SVGSVGElement>) {
          setState({ lastScreenPos: null })
        }

        return (
          <svg
            viewBox={formatRect(state.viewRect)}
            onWheel={onWheel}
            onMouseDownCapture={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {children}
          </svg>
        )
      }}
    </StateWrapper>
  )
}

function screenPosFromEvent(e: React.MouseEvent<SVGSVGElement>) {
  return { x: e.clientX, y: e.clientY }
}

function worldPosFromEvent(e: React.MouseEvent<SVGSVGElement>) {
  return worldPosFromScreenPos(e.currentTarget, screenPosFromEvent(e))
}

function worldPosFromScreenPos(svg: SVGSVGElement, { x, y }: Point) {
  const screenPos = svg.createSVGPoint()
  screenPos.x = x
  screenPos.y = y
  return screenPos.matrixTransform(svg.getScreenCTM()!.inverse())
}

function zoomedViewRect(
  viewRect: Rect,
  worldPos: DOMPoint,
  zoomFactor: number,
): Rect {
  function moveCoordinate(tl: number, wp: number) {
    return tl + (wp - tl) * (1 - zoomFactor)
  }
  const topLeft = {
    x: moveCoordinate(viewRect.topLeft.x, worldPos.x),
    y: moveCoordinate(viewRect.topLeft.y, worldPos.y),
  }
  const size = {
    w: viewRect.size.w * zoomFactor,
    h: viewRect.size.h * zoomFactor,
  }

  return { topLeft, size }
}

function draggedViewRect(
  viewRect: Rect,
  lastDragPos: DOMPoint,
  dragPos: DOMPoint,
): Rect {
  const topLeft = {
    x: viewRect.topLeft.x - (dragPos.x - lastDragPos.x),
    y: viewRect.topLeft.y - (dragPos.y - lastDragPos.y),
  }
  return { topLeft, size: viewRect.size }
}
