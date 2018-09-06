import * as React from 'react'
import { Rect, Point, Size } from '../types'
import { formatRect } from '../lib/svg'
import log from '../lib/log'

export interface SvgViewerProps {
  minViewSize: Size
  maxViewSize: Size
  initialViewRect: Rect
  scrollSpeed: number
  scrollBorderSize: number
  onRightClick: () => void
}

interface State {
  viewRect: Rect
  scrollInfo: ScrollInfo | null

  wKey: boolean
  aKey: boolean
  sKey: boolean
  dKey: boolean
}

interface ScrollInfo {
  direction: Point
  startTime: Date
  startOffset: Point
}

export default class SvgViewer extends React.Component<SvgViewerProps, State> {
  constructor(props: SvgViewerProps) {
    super(props)
    this.state = {
      viewRect: this.props.initialViewRect,
      scrollInfo: null,
      wKey: false,
      aKey: false,
      sKey: false,
      dKey: false,
    }
  }

  render() {
    return (
      <svg
        viewBox={formatRect(this.state.viewRect)}
        onWheel={e => this.onWheel(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseLeave={e => this.onMouseLeave(e)}
        onMouseDown={e => this.onMouseDown(e)}
      >
        {this.props.children}
      </svg>
    )
  }

  onWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault()
    const worldPos = worldPosFromEvent(e)
    const zoomFactor = e.deltaY > 0 ? 1.2 : 1 / 1.2
    const viewRect = zoomViewRect(
      this.state.viewRect,
      worldPos,
      zoomFactor,
      this.props.minViewSize,
      this.props.maxViewSize,
    )
    this.setState({ viewRect })
  }

  onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (
      this.state.wKey ||
      this.state.aKey ||
      this.state.sKey ||
      this.state.dKey
    )
      return

    const rect = e.currentTarget.getBoundingClientRect()

    let x = 0
    if (e.pageX - rect.left < this.props.scrollBorderSize) x = -1
    else if (rect.right - e.pageX < this.props.scrollBorderSize) x = +1

    let y = 0
    if (e.pageY - rect.top < this.props.scrollBorderSize) y = -1
    if (rect.bottom - e.pageY < this.props.scrollBorderSize) y = +1

    this.setScrollDirection(x, y)
  }

  onMouseLeave(e: React.MouseEvent<SVGSVGElement>) {
    this.setState({ scrollInfo: null })
  }

  onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (e.button == 2) {
      this.props.onRightClick()
    }
  }

  setScrollDirection(x: number, y: number) {
    if (x == 0 && y == 0) {
      this.setState({ scrollInfo: null })
    }

    const scrollInfo = this.state.scrollInfo
    if (
      scrollInfo &&
      scrollInfo.direction.x == x &&
      scrollInfo.direction.y == y
    ) {
      return
    }

    this.setState({
      scrollInfo: {
        direction: { x, y },
        startTime: new Date(),
        startOffset: this.state.viewRect.topLeft,
      },
    })

    this.startScrollTimer()
  }

  calculateScroll() {
    const scrollInfo = this.state.scrollInfo
    if (!scrollInfo) {
      this.stopScrollTimer()
      return
    }

    const dt = new Date().getTime() - scrollInfo.startTime.getTime()

    const dx = scrollInfo.direction.x * this.props.scrollSpeed * dt
    const dy = scrollInfo.direction.y * this.props.scrollSpeed * dt

    const topLeft = {
      x: scrollInfo.startOffset.x + dx,
      y: scrollInfo.startOffset.y + dy,
    }

    const viewRect = { ...this.state.viewRect, topLeft }
    this.setState({ viewRect })
  }

  scrollTimerId: number | null

  startScrollTimer() {
    if (this.scrollTimerId) return
    this.scrollTimerId = window.setInterval(
      () => this.calculateScroll(),
      1000 / 60,
    )
  }

  stopScrollTimer() {
    if (this.scrollTimerId) {
      window.clearInterval(this.scrollTimerId)
      this.scrollTimerId = null
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    this.setState(
      state => ({
        wKey: state.wKey || e.key == 'w',
        aKey: state.aKey || e.key == 'a',
        sKey: state.sKey || e.key == 's',
        dKey: state.dKey || e.key == 'd',
      }),
      () => this.updateScrollFromKeys(),
    )
  }

  onKeyUp = (e: KeyboardEvent) => {
    this.setState(
      state => ({
        wKey: state.wKey && e.key != 'w',
        aKey: state.aKey && e.key != 'a',
        sKey: state.sKey && e.key != 's',
        dKey: state.dKey && e.key != 'd',
      }),
      () => this.updateScrollFromKeys(),
    )
  }

  updateScrollFromKeys() {
    let x = 0
    let y = 0
    if (this.state.wKey) y -= 1
    if (this.state.aKey) x -= 1
    if (this.state.sKey) y += 1
    if (this.state.dKey) x += 1
    this.setScrollDirection(x, y)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    this.stopScrollTimer()
  }
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
