import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Topbar() {
  const { balance } = useContext(AppContext);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  return (
    <div className="top-container m-2 mb-5 rounded-2xl bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl p-5 text-white relative border border-cyan-600/50 backdrop-blur-sm">
      {/* Ocean glow effects */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-cyan-400/20 blur-2xl rounded-full"></div>
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-emerald-400/15 blur-xl rounded-full"></div>
      
      <div className="wrapper flex justify-between items-center relative z-10">
        {/* Left */}
        <div className="left flex flex-col gap-3">
          <p className="text-lg font-semibold bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
            Available Balance: <span className="text-gray-300">₹{balance}</span>
          </p>

          {/* Options */}
          <div className="flex gap-3">
            <Link to={"/deposit"}>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 border border-emerald-400/30">
                Recharge
              </button>
            </Link>

            <Link to={"/withdraw"}>
              <button className="bg-white/90 hover:bg-white text-teal-700 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 font-semibold border border-white/50">
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        {/* Right
        <div>
          <button
            aria-label="User menu"
            onClick={() => setIsUserPopupOpen(true)}
            className="bg-white/90 text-teal-700 hover:bg-white h-12 w-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 border-2 border-cyan-200/50"
          >
            <i className="fa-solid fa-user text-lg"></i>
          </button>
        </div> */}
      </div>
    </div>
  );
}