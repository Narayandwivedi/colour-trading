import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
export default function Topbar() {
  const { availBalance } = useContext(AppContext);
  const [isUserPopupOpen , setIsUserPopupOpen] = useState(false)
  return (
    <div className="top-container p-3 m-3 mb-5">
      <div className="wrapper flex justify-between"> 
        {/* left */}

        <div className="left mb-4 flex flex-col gap-2">
          <p className="text-white">Available Balance : ₹ {availBalance}</p>
          {/* options */}

          <div className="flex gap-2">
          <Link to={"/addbalance"}>
            <button
              className="text-white rounded-sm shadow-md"
              style={{
                backgroundColor: "#2296f3",
                padding: "10px 12px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
              }}
            >
              Recharge
            </button>
          </Link>

          <Link to={"/withdraw"}>
            <button
              style={{
                backgroundColor: "white",
                padding: "10px 18px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
              }}
              className="rounded-sm shadow-lg "
            >
              withdraw
            </button>
          </Link>
        </div>
        </div>
        {/* right */}
        <div>
            <button onClick={()=>{setIsUserPopupOpen(true)}} className="bg-white h-[40px] w-[40px] rounded-full"><i class="fa-solid fa-user"></i></button>
        </div>
      </div>
      {/* user detail popup */}
      {
        isUserPopupOpen&&(
         <div>
           <div onClick={()=>{setIsUserPopupOpen(false)}} className="fixed inset-0 bg-black opacity-[50%]"></div>
           <div className="bg-white absolute w-[75%] top-0 bottom-0 left-0 z-10"></div>
         </div>
        )
      }
    </div>
  );
}
