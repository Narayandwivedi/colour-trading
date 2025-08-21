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
import PaymentPage from './pages/PaymentPage'
import BetHistory from "./pages/BetHistory"
import DepositHistory from './pages/DepositHistory'
import WithdrawalHistory from './pages/WithdrawalHistory'
import AddBank from './pages/AddBank'
import AddUpi from './pages/AddUpi'
import Support from './pages/Support'
import ResetPass from './pages/ResetPass'
import ChatPage from './pages/ChatPage'


function App() {

  const { loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // ✅ wait for checkLogin to finish

  return (
  <div className='max-w-[440px] mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative overflow-hidden'>
    <ToastContainer autoClose={600} />
  <Routes>
    
     <Route path='/' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path='/support' element={<Support />} />

    <Route path='/colourtrading' element={<ProtectedRoute><ColourTrading/></ProtectedRoute>}/>
    <Route path='/mine' element={<Mine/>}/>
    <Route path='/aviator' element={<Aviator/>}/>
    <Route path='/refer' element={<ProtectedRoute><Refer /></ProtectedRoute>} />
          {/* <Route path='/wallet' element={<Wallet />} /> */}
          <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path='/deposit' element={<ProtectedRoute><Addbalance /></ProtectedRoute>} />
          <Route path='/payment' element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path='/withdraw' element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/bethistory' element={<ProtectedRoute><BetHistory /></ProtectedRoute>} />
          <Route path='/deposithistory' element={<ProtectedRoute><DepositHistory /></ProtectedRoute>} />
          <Route path='/withdrawhistory' element={<ProtectedRoute><WithdrawalHistory /></ProtectedRoute>} />
          <Route path='/addbank' element={<ProtectedRoute><AddBank /></ProtectedRoute>} />
          <Route path='/addupi' element={<ProtectedRoute><AddUpi /></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path='/reset-pass' element={<ResetPass/>} />

    
  </Routes>
  </div>
  )
}

export default App
