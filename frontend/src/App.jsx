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
import Refer from './pages/bottomNavPages/Refer'
import Wallet from './pages/bottomNavPages/Wallet'
import Account from './pages/bottomNavPages/Account'

function App() {

  const { loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // ✅ wait for checkLogin to finish

  return (
  <div className='max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow'>
    <ToastContainer/>
  <Routes>
    
    <Route path='/' element={<Homepage/>}/>
    <Route path='/colourtrading' element={<ColourTrading/>}/>
    <Route path='/refer' element={<Refer/>}/>
    <Route path='/wallet' element={<Wallet/>}/>
    <Route path='/account' element={<Account/>}/>
    <Route path='/mine' element={<Mine/>}/>
    <Route path='/aviator' element={<Aviator/>}/>
    <Route path='/addbalance' element={<Addbalance/>}/>
    <Route path='/withdraw' element={<Withdraw/>}/>
    <Route path='/login' element={<Login/>  }/>
  </Routes>
  </div>
  )
}

export default App
