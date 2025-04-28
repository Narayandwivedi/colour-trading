import React from "react";
import { useState } from "react";
import { toast } from 'react-toastify';
const Transaction = () => {
  // Sample data - in a real app this would come from props or state
  const transactions = [
    {
      id: 1,
      userId: "11223344556",
      utr: "282373728822",
      status: "pending",
    },
    {
      id: 2,
      userId: "99887766554",
      utr: "192837465012",
      status: "completed",
    },
    {
      id: 3,
      userId: "55443322110",
      utr: "564738291023",
      status: "failed",
    },
  ];

  const [totalAmount, setTotalAmount] = useState(null)
 
  const handelApprove =  async()=>{

    if(!totalAmount){
        return toast.error("please enter amount")
    }
    toast.success(`${totalAmount} is deposited successfully`)
    
  }
  const handelReject =  async()=>{

  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 items-center gap-4 bg-gray-50 p-4 border-b border-gray-200">
        <p className="text-lg font-medium text-gray-700">User ID</p>
        <p className="text-lg font-medium text-gray-700">UTR</p>
        <p className="text-lg font-medium text-gray-700">Status</p>
        <p className="text-lg font-medium text-gray-700">total amount</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-6 items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <p className="text-gray-800 font-medium">{transaction.userId}</p>
            <p className="text-gray-600">{transaction.utr}</p>
            
            {/* Status with colored indicator */}
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${
                transaction.status === 'pending' ? 'bg-yellow-500' :
                transaction.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="capitalize">{transaction.status}</span>
            </div>
            
            {/* total amount */}
              
              <input onChange={(e)=>{setTotalAmount(e.target.value)}} value={totalAmount}  className="border border-gray-500 w-[90px] rounded-md" placeholder="₹0.00" type="number" name="" id="" />

             {/* Success Button */}
             <button onClick={handelApprove} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
              Approve
              <span className="h-2 w-2 bg-white rounded-full ml-2"></span>
            </button>

            {/* Reject Button */}
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
              Reject
              <span className="h-2 w-2 bg-white rounded-full ml-2"></span>
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Transaction;