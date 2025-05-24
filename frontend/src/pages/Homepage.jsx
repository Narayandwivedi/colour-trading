import { Link } from "react-router-dom";
import aviator3 from "../assets/aviator3.png";

export default function Homepage() {
  return (
    // Main container with max-width and centered on larger screens
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pb-20 mx-auto max-w-[440px] relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gray-100 -z-10 w-screen" />
      
      <nav className="bg-white shadow-md px-4 py-3 max-w-[440px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Winners Club
          </h1>
          <div className="text-indigo-600 hover:text-purple-600 transition-transform transform hover:scale-110">
            <i class="fa-solid fa-bell text-xl"></i>
          </div>
        </div>
      </nav>

      {/* banner */}

         <div className="relative w-full max-w-[440px] mx-auto mt-4 px-4">
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden text-white">
        {/* Glow ring */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-pink-400/40 blur-2xl rounded-full z-0"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-lg sm:text-xl font-semibold">🎉 First Deposit Offer!</p>
            <p className="text-sm sm:text-base mt-1">Deposit ₹500 and get</p>
          </div>

          <div className="bg-white text-purple-600 font-extrabold text-xl sm:text-2xl px-4 py-2 rounded-full shadow-lg animate-pulse">
            ₹50 BONUS
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
          <div className="absolute w-1/3 h-full bg-white/20 transform rotate-12 animate-shine" />
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
            animation: shine 2.5s infinite ease-in-out;
          }
        `}
      </style>
    </div>

      <div className="flex flex-col items-center gap-5 mt-5 px-4">
        {/* Color Trading */}
        <Link to={"/colourtrading"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-2xl cursor-pointer shadow-lg border-2 border-white/30 hover:border-indigo-200/60">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-indigo-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Color</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Play Now →</p>
              </div>
              <div className="relative w-[100px] h-[100px] mt-3 mr-5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-red-500 to-green-500 shadow-2xl border-4 border-white flex items-center justify-center">
                  <div className="w-[85%] h-[85%] rounded-full bg-white/30 backdrop-blur-sm border-[3px] border-white/50 flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-3">
                      <span className="w-3 h-3 bg-red-700 rounded-full shadow-md"></span>
                      <span className="w-3 h-3 bg-green-700 rounded-full shadow-md"></span>
                    </div>
                    <span className="w-3 h-3 bg-violet-700 rounded-full shadow-md"></span>
                    <div className="flex gap-3">
                      <span className="w-3 h-3 bg-green-700 rounded-full shadow-md"></span>
                      <span className="w-3 h-3 bg-red-700 rounded-full shadow-md"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Aviator */}
        <Link to={"/aviator"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-amber-100 via-rose-100 to-blue-100 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-rose-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Aviator</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Play Now →</p>
              </div>
              <img
                className="w-[130px] h-[130px] object-contain transform hover:scale-105 transition-transform drop-shadow-lg"
                src={aviator3}
                alt="Aviator Game"
              />
            </div>
          </div>
        </Link>

        {/* Mines */}
        <Link to={"/mine"} className="w-full max-w-[320px]">
          <div className="h-[160px] w-full bg-gradient-to-br from-emerald-100 via-white to-amber-100 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-white/30 hover:border-emerald-200/60">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-emerald-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Mines</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Play Now →</p>
              </div>
              <div className="relative w-[80px] h-[80px] mt-10 mr-5">
                <div className="absolute inset-0 rounded-full bg-black shadow-inner border-[6px] border-yellow-500 overflow-hidden">
                  <div className="absolute w-6 h-10 bg-white/20 rounded-full top-4 left-5 rotate-[25deg]"></div>
                  <div className="absolute w-3 h-3 bg-white/30 rounded-full bottom-3 left-6"></div>
                  <div className="absolute w-4 h-4 bg-black/40 rounded-full bottom-5 right-5"></div>
                </div>
                <div className="absolute top-[-20px] left-[40%] w-[20px] h-[20px] bg-black rotate-45 rounded-sm z-10"></div>
                <div className="absolute top-[-45px] left-[45%] w-[6px] h-[40px] bg-[conic-gradient(brown,burlywood)] rotate-[15deg] rounded-sm z-20"></div>
                <div className="absolute top-[-65px] left-[30px] animate-ping">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white shadow-t border-t border-gray-300 flex justify-around items-center py-2 z-50">
        <Link to="/colourtrading" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
          <i class="fa-solid fa-house text-xl"></i>
          <span className="text-xs">Home</span>
        </Link>
        
        <Link to="/refer" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
         <i className="fa-solid fa-share-nodes text-xl"></i>
          <span className="text-xs">Refer&Earn</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center text-gray-600 hover:text-purple-600">
          <i className="fa-solid fa-wallet text-xl"></i>
          <span className="text-xs">Wallet</span>
        </Link>

        <Link to="/aviator" className="flex flex-col items-center text-gray-600 hover:text-rose-600">
          <i className="fa-solid fa-user text-xl"></i>
          <span className="text-xs">Account</span>
        </Link>
      </div>
    </div>
  );
}