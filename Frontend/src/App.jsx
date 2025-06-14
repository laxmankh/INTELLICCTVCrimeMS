import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login'
import CrimeRecords from './Components/CrimeRecords'
import CrimeDashboard from './Components/CrimeDashboard'
import Home from './Components/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Login></Login> */}
    {/* <CrimeRecords></CrimeRecords> */}
    {/* <CrimeDashboard></CrimeDashboard> */}
    <Home></Home>
    </>
  )
}

export default App
