import * as React from 'react'
import { Rect, Point, Size } from '../../types'
import { formatRect } from '../../lib/svg'
import log from '../../lib/log'

export interface SvgViewerProps {
  center: Point
  size: number

  scrollSpeed: number

  zoomFactor: number
  zoomInSteps: number
  zoomOutSteps: number

  onRightClick: () => void
}

interface State {
  center: Point

  scrollInfo: ScrollInfo | null
  wKey: boolean
  aKey: boolean
  sKey: boolean
  dKey: boolean

  zoomStep: number
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
      center: props.center,
      scrollInfo: null,
      wKey: false,
      aKey: false,
      sKey: false,
      dKey: false,
      zoomStep: 0,
    }
  }

  render() {
    const size =
      this.props.size * Math.pow(this.props.zoomFactor, this.state.zoomStep)

    const left = this.state.center.x - size / 2
    const top = this.state.center.y - size / 2
    const width = size
    const height = size

    return (
      <svg
        viewBox={`${left} ${top} ${width} ${height}`}
        onWheel={e => this.onWheel(e)}
        onMouseDown={e => this.onMouseDown(e)}
      >
        {this.props.children}
      </svg>
    )
  }

  onWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault()
    if (e.deltaY > 1) {
      const zoomStep = this.state.zoomStep + 1
      if (zoomStep <= this.props.zoomInSteps) {
        this.setState({ zoomStep })
      }
    } else {
      const zoomStep = this.state.zoomStep - 1
      if (-zoomStep <= this.props.zoomOutSteps) {
        this.setState({ zoomStep })
      }
    }
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
        startOffset: this.state.center,
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

    const center = {
      x: scrollInfo.startOffset.x + dx,
      y: scrollInfo.startOffset.y + dy,
    }

    this.setState({ center })
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
