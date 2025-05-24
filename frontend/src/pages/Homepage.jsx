import { Link } from "react-router-dom"
import aviator3 from "../assets/aviator3.png"
// import minesIcon from "../assets/mines-icon.png" // You'll need to add this image
// import diceIcon from "../assets/dice-icon.png" // You'll need to add this image



export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <nav className="bg-white shadow-md px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Winners Club
          </h1>
          <div className="text-indigo-600 hover:text-purple-600 transition-transform transform hover:scale-110">
            <i className="fa-solid fa-wallet text-xl sm:text-2xl"></i>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center gap-8 mt-12 pb-10">
        {/* Color Trading */}
        <Link to={"/colourtrading"}>
          <div className="h-[160px] w-[340px] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-2xl cursor-pointer shadow-lg border-2 border-white/30 hover:border-indigo-200/60">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-indigo-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Color</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Play Now →</p>
              </div>

              <div className="relative w-[100px] h-[100px] mt-3 mr-5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-red-500 to-green-500 shadow-2xl border-4 border-white flex items-center justify-center">
                  <div className="w-[85%] h-[85%] rounded-full bg-white/30 backdrop-blur-sm border-[3px] border-white/50 flex flex-col items-center justify-center gap-1">
                    {/* Dice dots */}
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
        <Link to={"/aviator"}>
          <div className="h-[160px] w-[340px] bg-gradient-to-br from-amber-100 via-rose-100 to-blue-100 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40">
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
        <Link to={"/mine"}>
          <div className="h-[160px] w-[340px] bg-gradient-to-br from-emerald-100 via-white to-amber-100 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-white/30 hover:border-emerald-200/60">
            <div className="h-full flex items-center justify-between px-7">
              <div className="flex flex-col">
                <p className="text-2xl font-extrabold text-emerald-600">WIN</p>
                <p className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Mines</p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Play Now →</p>
              </div>
              <div class="relative w-[80px] h-[80px] mt-10 mr-5">
                {/* <!-- Bomb Body --> */}
                <div class="absolute inset-0 rounded-full bg-black shadow-inner border-[6px] border-yellow-500 overflow-hidden">
                  {/* <!-- Reflections --> */}
                  <div class="absolute w-6 h-10 bg-white/20 rounded-full top-4 left-5 rotate-[25deg]"></div>
                  <div class="absolute w-3 h-3 bg-white/30 rounded-full bottom-3 left-6"></div>
                  <div class="absolute w-4 h-4 bg-black/40 rounded-full bottom-5 right-5"></div>
                </div>

                {/* <!-- Fuse Base --> */}
                <div class="absolute top-[-20px] left-[40%] w-[20px] h-[20px] bg-black rotate-45 rounded-sm z-10"></div>

                {/* <!-- Fuse Wire --> */}
                <div class="absolute top-[-45px] left-[45%] w-[6px] h-[40px] bg-[conic-gradient(brown,burlywood)] rotate-[15deg] rounded-sm z-20"></div>

                {/* <!-- Spark --> */}
                <div class="absolute top-[-65px] left-[30px] animate-ping">
                  <div class="w-8 h-8 rounded-full bg-yellow-400 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </Link>



      </div>
    </div>
  )
}



