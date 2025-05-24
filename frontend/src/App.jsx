import { useContext, useState } from 'react'
import './App.css'
import Addbalance from './components/Addbalance'
import { Routes, Route } from 'react-router-dom'
import Withdraw from './components/Withdraw'
import Login from './components/Login'
import { ToastContainer} from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute'
import Homepage from './pages/Homepage'
import Mine from "./pages/Mine"
import Aviator from "./pages/Aviator"
import ColourTrading from "./pages/ColourTrading"
import { AppContext } from './context/AppContext'

function App() {

  const { loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // ✅ wait for checkLogin to finish

  return (
  <div className='max-w-[480px] mx-auto bg-white min-h-screen rounded-lg shadow'>
    <ToastContainer/>
  <Routes>
    
    <Route path='/' element={<ProtectedRoute><Homepage/></ProtectedRoute>}/>
    <Route path='/colourtrading' element={<ProtectedRoute><ColourTrading/></ProtectedRoute>}/>
     <Route path='/mine' element={<ProtectedRoute><Mine/></ProtectedRoute>}/>
      <Route path='/aviator' element={<ProtectedRoute><Aviator/></ProtectedRoute>}/>
    <Route path='/addbalance' element={<ProtectedRoute><Addbalance/></ProtectedRoute>}/>
    <Route path='/withdraw' element={<Withdraw/>}/>
    <Route path='/login' element={<Login/>  }/>
  </Routes>
  </div>
  )
}

export default App
