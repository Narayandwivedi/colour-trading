import { createContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const GameContext = createContext();
export const WalletContext = createContext();

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.winners11.in';
const WS_URL = BACKEND_URL.replace(/^http/, 'ws');

export const AppContextProvider = (props) => {
  // --- Auth state ---
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Game state ---
  const [selectedBetColour, setSelectedBetColour] = useState(null);
  const [selectedBetSize, setSelectedBetSize] = useState(null);
  const [selectedBetNumber, setSelectedBetNumber] = useState(null);
  const [betAllowed, setBetAllowed] = useState(true);
  const [showWinner, setShowWinner] = useState(false);
  const [timer, setTimer] = useState(30);
  const [period, setPeriod] = useState(null);
  const [periodCreatedAT, setPeriodCreatedAT] = useState(null);
  const [gameType, setGameType] = useState(() => {
    try { return localStorage.getItem('gameType') || '30sec'; }
    catch { return '30sec'; }
  });
  const [activeBets, setActiveBets] = useState(() => {
    try {
      const saved = localStorage.getItem('activeBets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [latestResult, setLatestResult] = useState(null);

  // --- Wallet state ---
  const [balance, setBalance] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [finalDepositAmt, setFinalDepositAmt] = useState(100);

  // --- WebSocket ---
  const wsRef = useRef(null);
  const wsListenersRef = useRef(new Set());

  const sendWS = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const subscribeWS = useCallback((gt) => {
    sendWS({ type: 'subscribe', gameType: gt });
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
      ws.onopen = () => subscribeWS(gameType);
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
      ws.onerror = () => ws.close();
    }
    connect();
    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) subscribeWS(gameType);
  }, [gameType, subscribeWS]);

  // --- Persist ---
  useEffect(() => { localStorage.setItem('activeBets', JSON.stringify(activeBets)); }, [activeBets]);
  useEffect(() => { localStorage.setItem('gameType', gameType); }, [gameType]);

  // --- Auth check ---
  const checkLogin = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, { withCredentials: true });
      if (res.data.isLoggedIn) {
        setUserData(res.data.user);
        setBalance(res.data.user.balance);
        setWithdrawableBalance(res.data.user.withdrawableBalance);
      } else setUserData(null);
    } catch (err) { setUserData(null); }
    finally { setLoading(false); }
  }, []);

  const checkAuthStatus = checkLogin;

  useEffect(() => { checkLogin(); }, [checkLogin]);

  // --- Memoized context values ---
  const authValue = useMemo(() => ({
    userData, loading, checkLogin, checkAuthStatus, setUserData,
  }), [userData, loading, checkLogin, checkAuthStatus]);

  const gameValue = useMemo(() => ({
    selectedBetColour, setSelectedBetColour,
    selectedBetSize, setSelectedBetSize,
    selectedBetNumber, setSelectedBetNumber,
    betAllowed, setBetAllowed,
    showWinner, setShowWinner,
    timer, setTimer,
    period, setPeriod,
    periodCreatedAT, setPeriodCreatedAT,
    gameType, setGameType,
    activeBets, setActiveBets,
    latestResult, setLatestResult,
    onWSMessage, subscribeWS, sendWS,
  }), [
    selectedBetColour, selectedBetSize, selectedBetNumber,
    betAllowed, showWinner, timer, period, periodCreatedAT,
    gameType, activeBets, latestResult,
    onWSMessage, subscribeWS, sendWS,
  ]);

  const walletValue = useMemo(() => ({
    balance, setBalance,
    withdrawableBalance, setWithdrawableBalance,
    finalDepositAmt, setFinalDepositAmt,
  }), [balance, withdrawableBalance, finalDepositAmt]);

  return (
    <AuthContext.Provider value={authValue}>
      <GameContext.Provider value={gameValue}>
        <WalletContext.Provider value={walletValue}>
          {props.children}
        </WalletContext.Provider>
      </GameContext.Provider>
    </AuthContext.Provider>
  );
};
