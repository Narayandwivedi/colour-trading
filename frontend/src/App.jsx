import { useContext, useState } from 'react'
import './App.css'
import Addbalance from './components/Addbalance'
import { Routes, Route } from 'react-router-dom'
import Withdraw from './components/Withdraw'
import Login from './components/Login'
import { ToastContainer} from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute'
import Homepage from './pages/Homepage'
import { AppContext } from './context/AppContext'

function App() {

  const { loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // ✅ wait for checkLogin to finish

  return (
  <div className='max-w-[480px] mx-auto bg-white min-h-screen rounded-lg shadow'>
    <ToastContainer/>
  <Routes>
    <Route path='/' element={<ProtectedRoute><Homepage/></ProtectedRoute>}/>
    <Route path='/addbalance' element={<ProtectedRoute><Addbalance/></ProtectedRoute>}/>
    <Route path='/withdraw' element={<Withdraw/>}/>
    <Route path='/login' element={<Login/>  }/>
  </Routes>
  </div>
  )
}

export default App
