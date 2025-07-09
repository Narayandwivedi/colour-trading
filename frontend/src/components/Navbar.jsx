import React from 'react';
import { Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-4 max-w-[440px] mx-auto backdrop-blur-sm border-b border-cyan-600/50">
      <div className="flex items-center justify-between">
        {/* Winner Club Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              className="drop-shadow-2xl"
            >
              {/* Trophy Base */}
              <circle cx="24" cy="24" r="20" fill="url(#aquaGradient)" stroke="#22D3EE" strokeWidth="2"/>
              
              {/* Trophy Cup */}
              <path 
                d="M16 18 L32 18 L30 28 L18 28 Z" 
                fill="#67E8F9" 
                stroke="#06B6D4" 
                strokeWidth="1"
              />
              
              {/* Trophy Handles */}
              <path 
                d="M14 20 Q12 20 12 22 Q12 24 14 24" 
                fill="none" 
                stroke="#22D3EE" 
                strokeWidth="2"
              />
              <path 
                d="M34 20 Q36 20 36 22 Q36 24 34 24" 
                fill="none" 
                stroke="#22D3EE" 
                strokeWidth="2"
              />
              
              {/* Trophy Base */}
              <rect x="20" y="28" width="8" height="4" fill="#0891B2" rx="1"/>
              <rect x="18" y="32" width="12" height="3" fill="#0E7490" rx="1"/>
              
              {/* Star */}
              <path 
                d="M24 12 L25.5 16.5 L30 16.5 L26.5 19.5 L28 24 L24 21 L20 24 L21.5 19.5 L18 16.5 L22.5 16.5 Z" 
                fill="#FDE047"
                stroke="#FACC15"
                strokeWidth="0.5"
              />
              
              <defs>
                <linearGradient id="aquaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE"/>
                  <stop offset="50%" stopColor="#67E8F9"/>
                  <stop offset="100%" stopColor="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              WINNERS
            </h1>
            <p className="text-sm font-medium text-cyan-200 -mt-1 tracking-wider">
              CLUB
            </p>
          </div>
        </div>

        {/* Customer Support Link */}
        <Link 
          to="/support" 
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-4 py-2 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-2">
            <Headphones 
              size={20} 
              className="text-white drop-shadow-lg group-hover:text-cyan-50 transition-colors duration-300" 
            />
            <span className="text-white font-medium text-sm drop-shadow-lg group-hover:text-cyan-50 transition-colors duration-300">
              Support
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;