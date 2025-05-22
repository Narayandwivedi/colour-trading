import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import axios from "axios";

export default function Game() {
  const [isBetPopOpen, setIsBetPopOpen] = useState(false);
  const [betInp, setBetInp] = useState(100);
  const {
    timer,
    setTimer,
    BACKEND_URL,
    period,
    setPeriod,
    periodCreatedAT, 
    setPeriodCreatedAT
  } = useContext(AppContext);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  
  // timer code

useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - periodCreatedAT) / 1000);
        const timeLeft = Math.max(30 - elapsedSeconds,0)
        // console.log(timeLeft);
        setTimer(timeLeft)
    }, 300);
    return () => clearInterval(interval);
  }, [periodCreatedAT]);


  // fetch period code

  async function fetchLatestPeriod() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/period`,{
        withCredentials: true});
      if (data.success) {
        setPeriod(data.latestPeriod[0].period);
        console.log(period);
        const UpdatedcreatedAt = new Date(data.latestPeriod[0].createdAt); // use this directly
        setPeriodCreatedAT(UpdatedcreatedAt)
      }
    } catch (err) {
      console.log("error", err);
      setPeriod(null);
    }
  }

  // fetch period on component mount

  useEffect(() => {
    fetchLatestPeriod();
  }, []);
  

  // fetch period on every 2 sec on polling

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestPeriod();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  
  return (
    <div className="Game-container mt-8 p-4 text-gray-700 mb-8 bg-gray-100">
      <div className="game-options">
        <ul>
          <li>
            <a href="">Parity</a>
          </li>
          <li>
            <a href="">Spare</a>
          </li>
          <li>
            <a href="">Bcone</a>
          </li>
          <li>
            <a href="">Emerd</a>
          </li>
        </ul>
      </div>

      {/* period and timer code */}
      <div className="game-counter mt-8">
        <div className="sec-1">
          <p className="flex gap-3 text-gray-500">
            <i className="fa-solid fa-trophy text-2xl "></i>
            <span>Period</span>
          </p>
          <p className="text-2xl font-medium">{period}</p>
        </div>
        <div className="sec-2">
          <p className="text-gray-500">Count Down</p>
          <p className="text-2xl font-medium">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
      </div>
    </div>
  );
}