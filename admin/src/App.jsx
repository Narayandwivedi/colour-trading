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

function App() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊", description: "User statistics" },
    { path: "/manageusers", label: "Users", icon: "👥", description: "Manage users" },
    { path: "/withdraw", label: "Withdrawals", icon: "💸", description: "Manage withdraw" },
    { path: "/transaction", label: "Deposit", icon: "💳", description: "Manage Deposits" },
    { path: "/livebet", label: "Live Bets", icon: "🎲", description: "Live Bets" },
    { path: "/managebet", label: "Manage Bets", icon: "🎯", description: "Manage Bets" },
    { path: "/allbets", label: "See All Bets", icon: "📊", description: "Manage Bets" },
  ];

  const isActive = (path) => location.pathname === path;
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`flex ${isLoginPage ? 'justify-center items-center' : 'flex-col md:flex-row'} bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen`}>
      {/* Sidebar/Topbar - Hidden on login page */}
      {!isLoginPage && (
        <div className="w-full md:w-80 md:h-screen bg-white shadow-xl border-r border-gray-200">
          {/* Logo/Header - Desktop only */}
          <div className="hidden md:block p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">Admin Panel</h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-4">
            <div className="flex flex-col gap-2 mt-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <button className={`group flex items-center w-full p-4 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-[1.01] bg-gray-50'
                  }`}>
                    <span className={`text-xl md:text-2xl mr-3 md:mr-4 transition-transform duration-200 ${
                      isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold text-sm md:text-base ${
                        isActive(item.path) ? 'text-white' : 'text-gray-800'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs md:text-sm hidden md:block ${
                        isActive(item.path) ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer - Desktop only */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50 md:relative md:mt-auto">
            <div className="text-center text-sm text-gray-500">
              <p className="font-medium">Admin Dashboard v2.0</p>
              <p>© 2025 Your Company</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className={`${isLoginPage ? 'w-full' : 'flex-1'} overflow-auto`}>
        <div className={`${isLoginPage ? 'p-4' : 'p-1 md:p-6'}`}>
          {/* Page Header - Desktop only and not on login page */}
          {!isLoginPage && (
            <div className="hidden md:block mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">
                  {menuItems.find(item => item.path === location.pathname)?.icon || "📊"}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {menuItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
                </h2>
              </div>
              <p className="text-gray-600">
                {menuItems.find(item => item.path === location.pathname)?.description || "Welcome to your admin panel"}
              </p>
            </div>
          )}

          {/* Content Container */}
          <div className={`${isLoginPage ? '' : 'bg-white rounded-2xl shadow-sm border border-gray-200'} min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-12rem)]`}>
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