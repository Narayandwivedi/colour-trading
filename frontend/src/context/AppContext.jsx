import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedColour, setSelectedColour] = useState(null);
  const [winAmt, setWinAmt] = useState(0);
  const [winColour , setWinColour] = useState(null)
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(30);
  const [availBalance, setAvailBalance] = useState(0);
  const [betValue, setBetValue] = useState(null);
  const [userData , setUserData] = useState(null)
  const [period , setPeriod] = useState(null)
  const [periodCreatedAT , setPeriodCreatedAT] = useState(null)
  const [gameType , setGameType] = useState('30sec')
  const [loading, setLoading] = useState(true)

  const BACKEND_URL = `http://localhost:8080`;

  // 🔐 Check if user is logged in
const checkLogin = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
      withCredentials: true,
    });
    if (res.data.isLoggedIn) {
      setUserData(res.data.user);
      setAvailBalance(res.data.user.balance)
    } else {
      setUserData(null);
    }
  } catch (err) {
    setUserData(null);
  } finally {
    setLoading(false); // ✅ done checking
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
    betValue, setBetValue,
    userData , setUserData,
    period, setPeriod,
    periodCreatedAT , setPeriodCreatedAT,
    loading,setLoading,
    winColour , setWinColour,
    gameType , setGameType,
    BACKEND_URL,

    // Auth values
    checkLogin,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
