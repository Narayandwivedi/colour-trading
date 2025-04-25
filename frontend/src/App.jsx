import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import './App.css'
import Addbalance from './components/Addbalance'
import { Routes, Route } from 'react-router-dom'
import Withdraw from './components/Withdraw'
import Login from './components/Login'
import { ToastContainer} from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
  <div className='max-w-[480px] mx-auto bg-white min-h-screen rounded-lg shadow'>
    <ToastContainer/>
  <Routes>
    <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    <Route path='/addbalance' element={<Addbalance/>}/>
    <Route path='/withdraw' element={<Withdraw/>}/>
    <Route path='/login' element={<Login/>  }/>
  </Routes>
  </div>
  )
}

export default App
