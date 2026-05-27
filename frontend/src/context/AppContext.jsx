import { createContext, useState, useEffect, useRef, useCallback } from "react";
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
  const [gameType , setGameType] = useState(() => {
    try {
      return localStorage.getItem('gameType') || '30sec';
    } catch {
      return '30sec';
    }
  })
  const [finalDepositAmt , setFinalDepositAmt] = useState(100)
  const [loading, setLoading] = useState(true)
  const [activeBets, setActiveBets] = useState(() => {
    try {
      const saved = localStorage.getItem('activeBets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [latestResult, setLatestResult] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.winners11.in';
  const WS_URL = BACKEND_URL.replace(/^http/, 'ws');

  const wsRef = useRef(null);
  const wsListenersRef = useRef(new Set());

  const sendWS = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const subscribeWS = useCallback((gameType) => {
    sendWS({ type: 'subscribe', gameType });
  }, [sendWS]);

  const onWSMessage = useCallback((handler) => {
    wsListenersRef.current.add(handler);
    return () => wsListenersRef.current.delete(handler);
  }, []);

  useEffect(() => {
    let reconnectTimer;
    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        subscribeWS(gameType);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          wsListenersRef.current.forEach(fn => fn(msg));
        } catch (e) {}
      };

      ws.onclose = () => {
        wsRef.current = null;
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      subscribeWS(gameType);
    }
  }, [gameType, subscribeWS]);

  useEffect(() => {
    localStorage.setItem('activeBets', JSON.stringify(activeBets));
  }, [activeBets]);

  useEffect(() => {
    localStorage.setItem('gameType', gameType);
  }, [gameType]);

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
    setLoading(false);
  }
};

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
    latestResult, setLatestResult,

    BACKEND_URL,
    WS_URL,
    sendWS,
    subscribeWS,
    onWSMessage,

    checkLogin,
    checkAuthStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
