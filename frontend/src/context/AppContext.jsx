import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedColour, setSelectedColour] = useState(null);
  const [winAmt, setWinAmt] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(30);
  const [availBalance, setAvailBalance] = useState(0);
  const [winners, setWinners] = useState([]);
  const [betValue, setBetValue] = useState(null);
  const [userData , setUserData] = useState(null)
  const [period , setPeriod] = useState(null)
  const [periodCreatedAT , setPeriodCreatedAT] = useState(null)
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
      console.log(res.data);
    } else {
      setUser(null);
    }
  } catch (err) {
    setUser(null);
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
    winners, setWinners,
    betValue, setBetValue,
    userData , setUserData,
    period, setPeriod,
    periodCreatedAT , setPeriodCreatedAT,
    loading,setLoading,
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
