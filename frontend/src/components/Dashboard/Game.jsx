import { useState } from "react";
 
export default function Game({timer , onBetValueChange , onColorValueChange, availBalance , setAvailBalance}) {
  
  const [selectedColour , setSelectedColour] = useState(null)
  const minutes = Math.floor(timer/60)
  const seconds = timer%60
  const [isBetPopOpen, setIsBetPopOpen] = useState(false)
  const [betInp ,setBetInp] = useState(100)

  function handelBettingWindow(colour){
    setIsBetPopOpen(true)
    onColorValueChange(colour)
    setSelectedColour(colour)
    
  }

  function handelPlaceBet(){
   
    if(betInp>availBalance || betInp<=0){
        alert('invalid bet amount');
        return;
    }

      onBetValueChange(betInp)
      setIsBetPopOpen(false)
    setAvailBalance((prevBalance)=>{
      return prevBalance-betInp
  })
}


  function handelCloseBetting(){
    setIsBetPopOpen(false)
  }
  
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

      <div className="game-counter mt-8">
        <div className="sec-1">
          <p className="flex gap-3 text-gray-500">
            <i className="fa-solid fa-trophy text-2xl "></i>
            <span>Period</span>
          </p>
          <p className="text-2xl font-medium">20230830314</p>
        </div>
        <div className="sec-2">
          <p className="  text-gray-500 ">Count Down</p>
          <p className="text-2xl font-medium">{minutes}:{seconds<10?`0${seconds}`:seconds}</p>
        </div>
      </div>

      <div className="game-selection mt-8 text-white">
        <button onClick={()=>{handelBettingWindow("green")}} style={{ padding: "10px 12px", backgroundColor: "#4ab24a" }}>
          Join Green
        </button>
        <button onClick={()=>{handelBettingWindow("violet")}} style={{ padding: "10px 12px", backgroundColor: "#9e27b2" }}>
          Join Violet
        </button>
        <button onClick={()=>{handelBettingWindow("red")}} style={{ padding: "10px 12px", backgroundColor: "#f64136" }}>
          Join Red
        </button>
      </div>


    {
      isBetPopOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-6  rounded-lg shadow-lg w-96 z-60">
    <h2 className="text-2xl font-semibold mb-4">Place your bet on {selectedColour} </h2>
    <input
      type="number"
      placeholder="Enter amount"
      value={betInp}
      onChange={(e)=>{setBetInp(e.target.value)}}
      className="w-full p-2 border border-gray-300 rounded-lg mb-4"
    />
    <div className="flex justify-between">
      <button
        onClick={handelPlaceBet}
        className={`${selectedColour==="green"?"bg-green-500":selectedColour==="violet"?"bg-violet-500":"bg-red-500"} text-white p-2 rounded-lg w-1/2 mr-2`}
      >
        Place Bet
      </button>
      <button
        onClick={handelCloseBetting}
        className="bg-gray-500 text-white p-2 rounded-lg w-1/2 ml-2"
      >
        Close
      </button>
    </div>
  </div>
</div>

      )
    }
      

    </div>
  );
}
