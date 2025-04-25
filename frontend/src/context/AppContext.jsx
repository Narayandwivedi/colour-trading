import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedColour, setSelectedColour] = useState(null);
  const [winAmt, setWinAmt] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(10);
  const [availBalance, setAvailBalance] = useState(3000);
  const [winners, setWinners] = useState([]);
  const [betValue, setBetValue] = useState(null);

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
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
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
