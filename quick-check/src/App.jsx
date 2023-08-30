import { useState } from 'react'
import './App.css'
import AppRouter from './AppRouter'
import { AuthProvider } from './Components/AuthProvider'
import Computers from './Pages/computers'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
    <div className="App h-full w-full absolute">
      <AppRouter />
    </div>
    </AuthProvider>
  )
}

export default App
