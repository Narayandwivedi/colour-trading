import { useState } from "react"
import Homepage from "./pages/Homepage"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import Transaction from "./pages/Transaction"
import { ToastContainer } from 'react-toastify';
import ManageUser from "./pages/ManageUser";
import ManageWithdraw from "./pages/ManageWithdraw";
import LiveBets from "./pages/LiveBets";
import ManageBets from "./pages/ManageBets";
import AllBets from "./pages/AllBets";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatSupport from "./pages/ChatSupport";
import ChatNotification from "./components/ChatNotification";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊", description: "User statistics" },
    { path: "/manageusers", label: "Users", icon: "👥", description: "Manage users" },
    { path: "/withdraw", label: "Withdrawals", icon: "💸", description: "Manage withdraw" },
    { path: "/transaction", label: "Deposit", icon: "💳", description: "Manage Deposits" },
    { path: "/chat", label: "Chat Support", icon: "💬", description: "Manage customer support" },
    { path: "/livebet", label: "Live Bets", icon: "🎲", description: "Live Bets" },
    { path: "/managebet", label: "Manage Bets", icon: "🎯", description: "Manage Bets" },
    { path: "/allbets", label: "See All Bets", icon: "📊", description: "Manage Bets" },
  ];

  const isActive = (path) => location.pathname === path;
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`flex ${isLoginPage ? 'justify-center items-center' : 'flex-col md:flex-row'} bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen`}>
      {/* Mobile Navbar */}
      {!isLoginPage && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">Admin Panel</span>
            </div>
            <div className="w-10" />
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!isLoginPage && (
        <>
          {/* Backdrop - Mobile only */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-52 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:h-screen overflow-y-auto`}>
            {/* Logo/Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-white font-bold text-sm md:text-base">A</span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-sm md:text-base text-gray-800 truncate">Admin Panel</h1>
                  <p className="text-[10px] md:text-xs text-gray-500 truncate">Management Dashboard</p>
                </div>
                {/* Close button - Mobile only */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden ml-auto p-1 hover:bg-gray-100 rounded-lg shrink-0"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="p-3 md:p-3">
              <div className="flex flex-col gap-1 md:gap-1">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                    <button className={`group flex items-center w-full p-3 md:p-2.5 rounded-lg md:rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-gray-50'
                    }`}>
                      <span className={`text-base md:text-lg mr-2.5 md:mr-3 transition-transform duration-200 ${
                        isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-xs md:text-sm ${
                          isActive(item.path) ? 'text-white' : 'text-gray-800'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-[10px] md:text-xs hidden md:block ${
                          isActive(item.path) ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {item.path === '/chat' && !isActive(item.path) && (
                        <ChatNotification />
                      )}
                      {isActive(item.path) && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="text-center text-sm text-gray-500">
                <p className="font-medium">Admin Dashboard v2.0</p>
                <p>© 2025 Your Company</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Main content */}
      <div className={`${isLoginPage ? 'w-full' : 'flex-1'} overflow-auto ${isLoginPage ? '' : 'pt-14 md:pt-0'}`}>
        <div className={`${isLoginPage ? 'p-4' : 'p-2 md:p-6'}`}>
          {/* Content Container */}
          <div className={`${isLoginPage ? '' : 'bg-white rounded-2xl shadow-sm border border-gray-200'}`}>
            <div className={`${isLoginPage ? '' : 'p-1 md:p-6'}`}>
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Routes>
                <Route path="/" element={<ProtectedRoute><Homepage/></ProtectedRoute>}/>
                <Route path="/transaction" element={<ProtectedRoute><Transaction/></ProtectedRoute>}/>
                <Route path="/manageusers" element={<ProtectedRoute><ManageUser/></ProtectedRoute>}/>
                <Route path="/withdraw" element={<ProtectedRoute><ManageWithdraw/></ProtectedRoute>}/>
                <Route path="/chat" element={<ProtectedRoute><ChatSupport/></ProtectedRoute>}/>
                <Route path="/livebet" element={<ProtectedRoute><LiveBets/></ProtectedRoute>}/>
                <Route path="/managebet" element={<ProtectedRoute><ManageBets/></ProtectedRoute>}/>
                <Route path="/allbets" element={<ProtectedRoute><AllBets/></ProtectedRoute>}/>
                <Route path="/login" element={<Login/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App