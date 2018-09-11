import React from 'react'
import { Component } from 'react'

export default function withEventListeners(
  eventListeners: { [eventName: string]: (event: Event) => void },
  render: () => React.ReactNode,
) {
  class LifecycleComponent extends Component {
    componentDidMount() {
      for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName]
        window.addEventListener(eventName, listener)
      }
    }

    componentWillUnmount() {
      for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName]
        window.removeEventListener(eventName, listener)
      }
    }

    render() {
      return render()
    }
  }

  return <LifecycleComponent />
}

export function withHotkeys(
  hotkeys: { [key: string]: () => void },
  render: () => React.ReactNode,
) {
  return withEventListeners(
    {
      keydown: (e: KeyboardEvent) => {
        for (const key of Object.keys(hotkeys)) {
          if (e.key == key) {
            e.stopPropagation()
            e.preventDefault()
            hotkeys[key]()
          }
        }
      },
    },
    render,
  )
}
