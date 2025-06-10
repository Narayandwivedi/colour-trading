import { Link } from "react-router-dom";
import aviator3 from "../assets/aviator3.png";
import BottomNav from "../components/BottomNav";

export default function Homepage() {
  return (
    // Main container with stunning ocean-inspired gradient
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 mx-auto max-w-[440px] relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Stunning aqua-themed navbar */}

              <nav className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-4 max-w-[440px] mx-auto backdrop-blur-sm border-b border-cyan-600/50">
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
                WINNER
              </h1>
              <p className="text-sm font-medium text-cyan-200 -mt-1 tracking-wider">
                CLUB
              </p>
            </div>
          </div>
      </nav>
 
      {/* Vibrant ocean-themed banner */}
      <div className="relative w-full max-w-[440px] mx-auto mt-6 px-4">
        <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden text-white border border-teal-400/30">
          {/* Ocean glow effects */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-cyan-400/30 blur-3xl rounded-full z-0"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/20 blur-2xl rounded-full z-0"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-xl font-semibold">🎉 First Deposit Offer!</p>
              <p className="text-sm sm:text-base mt-1 text-teal-100">Deposit ₹500 and get</p>
            </div>

            <div className="bg-white text-teal-600 font-extrabold text-xl sm:text-2xl px-4 py-2 rounded-full shadow-2xl animate-pulse border-2 border-teal-200">
              ₹50 BONUS
            </div>
          </div>

          {/* Enhanced shine effect */}
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
            <div className="absolute w-1/3 h-full bg-white/15 transform rotate-12 animate-shine" />
          </div>
        </div>

        {/* Shine animation */}
        <style>
          {`
            @keyframes shine {
              0% { left: -50%; }
              100% { left: 120%; }
            }
            .animate-shine {
              animation: shine 3s infinite ease-in-out;
            }
          `}
        </style>
      </div>

      <div className="flex flex-col items-center gap-6 mt-8 px-4">
        {/* Ocean-themed Color Trading */}
        <Link to={"/colourtrading"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 rounded-2xl cursor-pointer shadow-2xl border-2 border-cyan-200/50 hover:border-cyan-300/80 hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-cyan-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Color</p>
                <p className="text-sm font-semibold text-teal-500 mt-1">Play Now →</p>
              </div>
              <div className="relative w-[100px] h-[100px] mt-3 mr-5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 via-teal-500 to-emerald-500 shadow-2xl border-4 border-white flex items-center justify-center">
                  <div className="w-[85%] h-[85%] rounded-full bg-white/40 backdrop-blur-sm border-[3px] border-white/60 flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-3">
                      <span className="w-3 h-3 bg-red-600 rounded-full shadow-lg"></span>
                      <span className="w-3 h-3 bg-green-600 rounded-full shadow-lg"></span>
                    </div>
                    <span className="w-3 h-3 bg-blue-600 rounded-full shadow-lg"></span>
                    <div className="flex gap-3">
                      <span className="w-3 h-3 bg-green-600 rounded-full shadow-lg"></span>
                      <span className="w-3 h-3 bg-red-600 rounded-full shadow-lg"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Sunset-themed Aviator */}
        <Link to={"/aviator"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100 rounded-2xl cursor-pointer shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 overflow-hidden border-2 border-orange-200/50 hover:border-orange-300/80 hover:scale-105">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-orange-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Aviator</p>
                <p className="text-sm font-semibold text-rose-500 mt-1">Play Now →</p>
              </div>
              <img
                className="w-[130px] h-[130px] object-contain transform hover:scale-110 transition-transform drop-shadow-2xl"
                src={aviator3}
                alt="Aviator Game"
              />
            </div>
          </div>
        </Link>

        {/* Forest-themed Mines */}
        <Link to={"/mine"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100 rounded-2xl cursor-pointer shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden border-2 border-emerald-200/50 hover:border-emerald-300/80 hover:scale-105">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-emerald-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Mines</p>
                <p className="text-sm font-semibold text-green-500 mt-1">Play Now →</p>
              </div>
              <div className="relative w-[80px] h-[80px] mt-10 mr-5">
                <div className="absolute inset-0 rounded-full bg-black shadow-2xl border-[6px] border-emerald-400 overflow-hidden">
                  <div className="absolute w-6 h-10 bg-white/25 rounded-full top-4 left-5 rotate-[25deg]"></div>
                  <div className="absolute w-3 h-3 bg-white/35 rounded-full bottom-3 left-6"></div>
                  <div className="absolute w-4 h-4 bg-black/50 rounded-full bottom-5 right-5"></div>
                </div>
                <div className="absolute top-[-20px] left-[40%] w-[20px] h-[20px] bg-black rotate-45 rounded-sm z-10 shadow-lg"></div>
                <div className="absolute top-[-45px] left-[45%] w-[6px] h-[40px] bg-gradient-to-b from-amber-700 to-amber-900 rotate-[15deg] rounded-sm z-20"></div>
                <div className="absolute top-[-65px] left-[30px] animate-ping">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 shadow-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <BottomNav/>
    </div>
  );
}