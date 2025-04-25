import { useContext, useEffect ,useState } from "react";
import { AppContext } from "../../context/AppContext";
export default function Result() {

  const {winners} = useContext(AppContext)
  return (
    <div className="result-container">
      <p className="flex gap-4 text-gray-500 justify-center mb-3">
        <i className="fa-solid fa-trophy text-xl "></i>
        <span>Period</span>
      </p>
      <hr style={{ border: "1px solid #019688" }} />

      <div className="result-history overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md">
  <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
    <thead className="bg-gray-100">
      <tr>
        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">Period</th>
        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">Big/Small</th>
        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">Number</th>
        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-600">Result</th>
      </tr>
    </thead>
    <tbody>
      {winners.map((item,index)=>
        <tr key={index} className="odd:bg-white even:bg-gray-50">
        <td className="border border-gray-300 text-center py-2 text-gray-700">20230830313</td>
        <td className="border border-gray-300 text-center py-2 text-gray-700">big</td>
        <td className="border border-gray-300 text-center py-2 text-gray-700">3</td>
        <td>
    
                  <div
                    className={`w-4 h-4 ${item.winColour === 'red' ?"bg-red-500": "bg-green-500"} rounded-full mx-auto`}
                  ></div>
                </td>
      </tr>
      )}
     
    </tbody>
  </table>
</div>

    </div>
  );
}
