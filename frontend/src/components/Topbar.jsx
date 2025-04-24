import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
export default function Topbar() {
  const { availBalance } = useContext(AppContext);
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
        <div className="mr-2">
          <Link to={'/login'}>
          <button className="bg-white p-2 rounded-md">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
