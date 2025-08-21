import React, { useContext, useState } from 'react';
import { ArrowLeft, Trophy, Menu, Headphones } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import MenuSidebar from './MenuSidebar';

const Navbar = () => {
  const { userData } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-teal-800 via-cyan-800 to-emerald-800 py-3 px-6 shadow-xl max-w-[440px] mx-auto">
        <div className="flex justify-between items-center">
          {/* Left side - Back button or Menu */}
          {!isHomePage && !isLoginPage ? (
            <div 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group"
              onClick={handleBackClick}
            >
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            </div>
          ) : userData ? (
            <div 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            </div>
          ) : (
            <div className="w-10 h-10"></div>
          )}
        
          {/* Center - Logo/Brand */}
          <Link to="/" className="flex items-center justify-center space-x-2 cursor-pointer">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">
              Winners<span className="text-yellow-300">11</span>
            </h1>
          </Link>
        
          {/* Right side - Support (only for logged-in users) */}
          {userData ? (
            <Link to="/chat">
              <div className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group">
                <Headphones className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10"></div>
          )}
        </div>
      </div>
      
      <MenuSidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;