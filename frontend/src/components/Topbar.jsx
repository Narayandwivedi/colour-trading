import { useContext } from "react";
import {Link} from "react-router-dom"
import { AppContext } from "../context/AppContext";
export default function Topbar() {
  const {availBalance} = useContext(AppContext)
  return (
    <div className="top-container p-3 m-3 mb-5">
      <div className="wrapper">
      <div className="balance mb-4">
        <p className="text-white">Available Balance : ₹ {availBalance}</p>
      </div>
      <div className="options flex gap-2">
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
    </div>
  );
}
