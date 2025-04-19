import { createContext } from "react";
import { useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const [selectedColour , setSelectedColour] = useState(null)
    const [winAmt , setWinAmt] = useState(0)
    const [showWinner, setShowWinner] = useState(false);
    const [timer, setTimer] = useState(10);
    const [availBalance, setAvailBalance] = useState(3000);
    const [winners, setWinners] = useState([]);
    const [betValue, setBetValue] = useState(null);

    const value = {
        selectedColour,setSelectedColour,
        winAmt , setWinAmt,
        showWinner , setShowWinner,
        timer,setTimer,
        availBalance,setAvailBalance,
        winners , setWinners,
        betValue , setBetValue
    }

    return (
        <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    )
}
