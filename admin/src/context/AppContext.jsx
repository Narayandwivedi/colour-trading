import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // const BACKEND_URL = `http://localhost:8080`; 
    const BACKEND_URL = `https://api.winners11.in`;

  const [stats, setStats] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/isloggedin`, {
        withCredentials: true,
      });
      if (res.data.isLoggedIn) {
        setUserData(res.data.user);
        setBalance(res.data.user.balance);
        setWithdrawableBalance(res.data.user.withdrawableBalance);
      } else {
        setUserData(null);
      }
    } catch (err) {
      setUserData(null);
    } finally {
      setLoading(false); // ✅ done checking
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
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
