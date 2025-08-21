import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedBetColour, setSelectedBetColour] = useState(null);
  const [selectedBetSize , setSelectedBetSize] = useState(null);
  const [ selectedBetNumber,setSelectedBetNumber] = useState(null)
  const [betAllowed , setBetAllowed] = useState(true)
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(30);
  const [balance, setBalance] = useState(0);
  const [withdrawableBalance , setWithdrawableBalance] = useState(0);
  const [userData , setUserData] = useState(null)
  const [period , setPeriod] = useState(null)
  const [periodCreatedAT , setPeriodCreatedAT] = useState(null)
  const [gameType , setGameType] = useState('30sec')
  const [finalDepositAmt , setFinalDepositAmt] = useState(100)
  const [loading, setLoading] = useState(true)
  const [activeBets, setActiveBets] = useState([]);

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.winners11.in';
  const BACKEND_URL = 'http://localhost:8080';
  
  
  

  
  // 🔐 Check if user is logged in
const checkLogin = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
      withCredentials: true,
    });
    if (res.data.isLoggedIn) {
      setUserData(res.data.user);
      setBalance(res.data.user.balance)
      setWithdrawableBalance(res.data.user.withdrawableBalance)
    } else {
      setUserData(null);
    }
  } catch (err) {
    setUserData(null);
  } finally {
    setLoading(false); // ✅ done checking
  }
};

// Rename checkLogin to checkAuthStatus for consistency with GoogleLogin component
const checkAuthStatus = checkLogin;

  useEffect(() => {
    checkLogin();
  }, []);

  const value = {
    selectedBetColour, setSelectedBetColour,
    selectedBetSize,setSelectedBetSize,
    selectedBetNumber , setSelectedBetNumber,
    showWinner, setShowWinner,
    timer, setTimer,
    userData , setUserData,
    period, setPeriod,
    periodCreatedAT , setPeriodCreatedAT,
    loading,setLoading,
    gameType , setGameType,
    balance, setBalance,
    withdrawableBalance,setWithdrawableBalance,
    finalDepositAmt , setFinalDepositAmt,
    betAllowed , setBetAllowed,
    activeBets , setActiveBets,
    
    BACKEND_URL,

    // Auth values
    checkLogin,
    checkAuthStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
