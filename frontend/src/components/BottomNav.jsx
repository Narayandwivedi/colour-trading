import React from 'react'
import { Link } from 'react-router-dom'

const BottomNav = () => {
  return (
    <div>
            {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white shadow-t border-t border-gray-300 flex justify-around items-center py-2 z-50">
        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-xs">Home</span>
        </Link>
        
        <Link to="/refer" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
         <i className="fa-solid fa-share-nodes text-xl"></i>
          <span className="text-xs">Refer&Earn</span>
        </Link>
  
        <Link to="/account" className="flex flex-col items-center text-gray-600 hover:text-rose-600">
          <i className="fa-solid fa-user text-xl"></i>
          <span className="text-xs">Account</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav