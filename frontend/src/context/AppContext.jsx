import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [selectedBetColour, setSelectedBetColour] = useState(null);
  const [selectedBetSize , setSelectedBetSize] = useState(null);
  const [betAllowed , setBetAllowed] = useState(true)
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(30);
  const [balance, setBalance] = useState(0);
  const [withdrawableBalance , setWithdrawableBalance] = useState(0);
  const [betValue, setBetValue] = useState(null);
  const [userData , setUserData] = useState(null)
  const [period , setPeriod] = useState(null)
  const [periodCreatedAT , setPeriodCreatedAT] = useState(null)
  const [gameType , setGameType] = useState('30sec')
  const [finalDepositAmt , setFinalDepositAmt] = useState(100)
  const [loading, setLoading] = useState(true)

  // const BACKEND_URL = `http://168.231.120.131:8080`;
  const BACKEND_URL = `http://localhost:8080`;
  

  
  // 🔐 Check if user is logged in
const checkLogin = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
      withCredentials: true,
    });
    if (res.data.isLoggedIn) {
      console.log(res.data.user);
      
      setUserData(res.data.user);
      setBalance(res.data.user.balance)
      setWithdrawableBalance(res.data.user.withdrawableBalance
)
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
    selectedBetColour, setSelectedBetColour,
    showWinner, setShowWinner,
    timer, setTimer,
    betValue, setBetValue,
    userData , setUserData,
    period, setPeriod,
    periodCreatedAT , setPeriodCreatedAT,
    loading,setLoading,
    gameType , setGameType,
    balance, setBalance,
    withdrawableBalance,setWithdrawableBalance,
    finalDepositAmt , setFinalDepositAmt,
    selectedBetSize,setSelectedBetSize,
    betAllowed , setBetAllowed,
    
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
