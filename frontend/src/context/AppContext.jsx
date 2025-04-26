import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedColour, setSelectedColour] = useState(null);
  const [winAmt, setWinAmt] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(10);
  const [availBalance, setAvailBalance] = useState(0);
  const [winners, setWinners] = useState([]);
  const [betValue, setBetValue] = useState(null);
  const [userData , setUserData] = useState(null)

  const [user, setUser] = useState(null); // 👈 For auth
  const BACKEND_URL = `https://colour-trading-server.vercel.app`;

  // 🔐 Check if user is logged in
  const checkLogin = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
        withCredentials: true,
      });

      if (res.data.isLoggedIn) {
        setUser(res.data.user);
        console.log(user);
        
      } else {
        setUser(null);
        console.log(user);
        
      }
    } catch (err) {
      setUser(null);
      console.log(user);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const value = {
    selectedColour, setSelectedColour,
    winAmt, setWinAmt,
    showWinner, setShowWinner,
    timer, setTimer,
    availBalance, setAvailBalance,
    winners, setWinners,
    betValue, setBetValue,
    userData , setUserData,
    BACKEND_URL,

    // Auth values
    user, setUser, checkLogin,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
