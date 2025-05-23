import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
export default function Result() {
  const [results, setResults] = useState([]);
  const { BACKEND_URL , winColour , setWinColour } = useContext(AppContext);

  const fetch_30_results = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/latest/result`);
      setResults(data.results);
      // if(data.results[0].period != winColour.period){
      //   console.log("hello");
      //    setWinColour({colour:data.results[0].colour , period: data.results[0].period})
        
      // }     
     
       
      
    } catch (err) {
      console.log("some error while fetching result data", err.message);
    }
  };

  console.log(winColour);
  

// implement later fecth only 1 result and push on top of array and remove last --> reduce db load

  // const fetch_1_result = async()=>{
  //   try {
  //     const { data } = await axios.get(`${BACKEND_URL}/api/latest/oneresult`);
  //     console.log(data);
      
  //   } catch (err) {
  //     console.log("some error while fetching result data", err.message);
  //   }
  // }

  useEffect(() => {
    fetch_30_results();
  }, []);


  useEffect(() => {
  
     const interval = setInterval(fetch_30_results, 2000);
     return ()=>{clearInterval(interval)}
  
  }, []);

  return (
    <div className="result-container mb-6">
      <p className="flex gap-4 text-gray-500 justify-center mb-3">
        <i className="fa-solid fa-trophy text-xl "></i>
        <span>Period</span>
      </p>
      <hr style={{ border: "1px solid #019688" }} />

      <div className="result-history overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Period
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Big/Small
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Number
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border text-[14px] border-gray-300 px-1 text-center py-2 text-gray-700">
                  {item.period}
                </td>
                <td className="border border-gray-300 text-center py-2 text-gray-700">
                  big
                </td>
                <td className="border border-gray-300 text-center py-2 text-gray-700">
                  4{" "}
                </td>
                <td>
                  <div
                    className={`w-4 h-4 ${
                      item.colour === "red" ? "bg-red-500" : "bg-green-500"
                    } rounded-full mx-auto`}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
