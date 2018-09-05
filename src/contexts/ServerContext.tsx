import * as React from 'react'
import { IServerProcess, createServerProcess } from '../server/ServerProcess'

export interface IServerContext {
  serverProcess: IServerProcess
}

export const ServerContext = React.createContext<IServerContext>(null as any)

interface ServerContextProviderProps {
  children: React.ReactNode
}

export function ServerContextProvider(props: ServerContextProviderProps) {
  const serverProcess = createServerProcess()
  return (
    <ServerContext.Provider value={{ serverProcess }}>
      {props.children}
    </ServerContext.Provider>
  )
}
