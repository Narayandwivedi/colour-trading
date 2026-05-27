import { createContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'; 

  const [stats, setStats] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const WS_URL = BACKEND_URL.replace(/^http/, 'ws');
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
      ws.onopen = () => {};
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

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
        withCredentials: true,
      });
      if (res.data.isLoggedIn) {
        setUserData(res.data.user);
      } else {
        setUserData(null);
      }
    } catch (err) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/stats`);
      setStats(data);
    } catch (err) {
      console.log("error fetching stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(()=>{
    checkLogin()
  },[])

  const value = {
    BACKEND_URL,
    stats,
    userData,
    setUserData,
    loading,
    setLoading,
    sendWS,
    subscribeWS,
    onWSMessage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
