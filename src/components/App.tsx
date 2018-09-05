import * as React from 'react'
import { ServerContextProvider } from '../contexts/ServerContext'
import ClientView from './ClientView'
import { HBox } from './layout'

export default function App() {
  return (
    <ServerContextProvider>
      <HBox>
        <ClientView playerName="Mond" playerColor="blue" />
        <ClientView playerName="Stern" playerColor="red" />
      </HBox>
    </ServerContextProvider>
  )
}
