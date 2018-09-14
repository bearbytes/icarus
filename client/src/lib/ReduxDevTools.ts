const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__

export function connectDevTools(name: string) {
  let connection: any
  if (devTools) {
    connection = devTools.connect({ name })
  }
  function send(action: { type: string }, state: any) {
    if (!connection) return
    connection.send(action, state)
  }
  return { send }
}
