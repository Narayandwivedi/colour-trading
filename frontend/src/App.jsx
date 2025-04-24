import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'
import Addbalance from './components/Addbalance'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
  <div className='max-w-[480px] mx-auto px-4 bg-white min-h-screen rounded-lg shadow'>
  <Routes>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/addbalance' element={<Addbalance/>}/>
  </Routes>
  
  </div>
  )
}

export default App
