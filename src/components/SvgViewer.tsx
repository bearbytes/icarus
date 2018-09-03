import * as React from 'react'
import { Rect, Point, Size } from '../types'
import { withState } from './hoc/withState'
import { formatRect } from '../lib/svg'

export interface SvgViewerProps {
  minViewSize: Size
  maxViewSize: Size
  initialViewRect: Rect
}

export default function SvgViewer(
  props: SvgViewerProps & { children: React.ReactNode },
) {
  const { initialViewRect, children, minViewSize, maxViewSize } = props

  const initialState = {
    viewRect: initialViewRect,
    lastScreenPos: null as Point | null,
  }
  return withState(initialState, (state, setState) => {
    function onWheel(e: React.WheelEvent<SVGSVGElement>) {
      e.preventDefault()
      const worldPos = worldPosFromEvent(e)
      const zoomFactor = e.deltaY > 0 ? 1.2 : 1 / 1.2
      let { viewRect } = state
      viewRect = zoomViewRect(
        viewRect,
        worldPos,
        zoomFactor,
        minViewSize,
        maxViewSize,
      )
      setState({ viewRect })
    }

    function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
      if (e.button != 2) return
      const lastScreenPos = screenPosFromEvent(e)
      setState({ lastScreenPos })
    }

    function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
      if (e.buttons != 2) return

      const { lastScreenPos } = state
      if (!lastScreenPos) return

      const screenPos = screenPosFromEvent(e)
      const svg = e.currentTarget

      const viewRect = dragViewRect(
        state.viewRect,
        worldPosFromScreenPos(svg, lastScreenPos),
        worldPosFromScreenPos(svg, screenPos),
      )

      setState({ viewRect, lastScreenPos: screenPos })
    }

    function onMouseUp(e: React.MouseEvent<SVGSVGElement>) {
      if (e.button != 2) return
      setState({ lastScreenPos: null })
    }

    return (
      <svg
        viewBox={formatRect(state.viewRect)}
        onWheel={onWheel}
        onMouseDownCapture={onMouseDown}
        onMouseMoveCapture={onMouseMove}
        onMouseUpCapture={onMouseUp}
      >
        {children}
      </svg>
    )
  })
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

function zoomViewRect(
  viewRect: Rect,
  worldPos: DOMPoint,
  zoomFactor: number,
  minSize: Size,
  maxSize: Size,
): Rect {
  if (
    (zoomFactor < 1 &&
      (viewRect.size.w < minSize.w || viewRect.size.h < minSize.h)) ||
    (zoomFactor > 1 &&
      (viewRect.size.w > maxSize.w || viewRect.size.h > maxSize.h))
  ) {
    return viewRect
  }

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

function dragViewRect(
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
