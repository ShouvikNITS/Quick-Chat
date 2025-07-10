import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import Loginpage from './pages/loginpage.jsx'
import Profilepage from './pages/profilepage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className=" bg-[url('./src/assets/bgImage.svg')] bg-contain">
    <Toaster />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Loginpage />} />
        <Route path='/profile' element={<Profilepage />} />
      </Routes>
    </div>
  )
}

export default App