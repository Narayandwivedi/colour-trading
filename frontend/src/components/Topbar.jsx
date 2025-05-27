import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Topbar() {
  const { balance } = useContext(AppContext);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  return (
    <div className="top-container m-3 mb-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg p-5 text-white">
      <div className="wrapper flex justify-between items-center">
        {/* Left */}
        <div className="left flex flex-col gap-3">
          <p className="text-lg font-semibold">Available Balance: ₹{balance}</p>

          {/* Options */}
          <div className="flex gap-3">
            <Link to={"/deposit"}>
              <button className="bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Recharge
              </button>
            </Link>

            <Link to={"/withdraw"}>
              <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg shadow-md transition">
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        {/* Right */}
        <div>
          <button
            onClick={() => setIsUserPopupOpen(true)}
            className="bg-white text-black hover:bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full shadow-md transition"
          >
            <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </div>

      {/* User Detail Popup */}
      {isUserPopupOpen && (
        <>
          <div
            onClick={() => setIsUserPopupOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
          ></div>
          <div className="bg-white absolute top-0 bottom-0 left-0 w-[75%] z-20 p-5">
            <p>User Details Here</p>
          </div>
        </>
      )}
    </div>
  );
}
