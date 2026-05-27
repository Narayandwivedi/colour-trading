import { useContext } from 'react'
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
import { Agentation } from "agentation";


function App() {

  const { loading } = useContext(AppContext);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
  <div className='max-w-[440px] mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative overflow-hidden'>
    <Agentation />
    <ToastContainer autoClose={600} />
  <Routes>
     <Route path='/' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path='/support' element={<Support />} />
    <Route path='/colourtrading' element={<ProtectedRoute><ColourTrading/></ProtectedRoute>}/>
    <Route path='/mine' element={<ProtectedRoute><Mine/></ProtectedRoute>}/>
    <Route path='/aviator' element={<ProtectedRoute><Aviator/></ProtectedRoute>}/>
    <Route path='/refer' element={<ProtectedRoute><Refer /></ProtectedRoute>} />
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
          <Route path='*' element={
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="text-center">
                <div className="text-6xl mb-4">404</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Page not found</h2>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all">
                  Go Home
                </a>
              </div>
            </div>
          } />
  </Routes>
  
  </div>
  )
}

export default App
