import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'
import Addbalance from './components/Addbalance'
import { Routes, Route } from 'react-router-dom'
import Withdraw from './components/Withdraw'

function App() {

  return (
  <div className='max-w-[480px] mx-auto bg-white min-h-screen rounded-lg shadow'>
  <Routes>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/addbalance' element={<Addbalance/>}/>
    <Route path='/withdraw' element={<Withdraw/>}/>
  </Routes>
  </div>
  )
}

export default App
