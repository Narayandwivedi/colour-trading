import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios"

 const Transaction = ()=>{

  const [totalAmount, setTotalAmount] = useState(null)
  const [allTransaction , setAllTransaction] = useState(null)
  const BACKEND_URL = 'https://colour-trading-server.vercel.app'

  const handelApprove =  async(userId)=>{

    if(!totalAmount){
        return toast.error("please enter amount")
    }
    
    try{
      const {data} = axios.put(`${BACKEND_URL}/api/users/addbalance`,{
        userId,
        totalAmount
      })
      if(data.success){
        toast.success(data.message)
      }
    }catch(err){
      toast.err(err.message)
    }
    
  }
  const handelReject =  async()=>{

  }

  useEffect(()=>{
    async function fetchAllTransaction() {
       try{
        const{data} = await axios.get(`${BACKEND_URL}/api/transaction`)
        if(data.success){
            setAllTransaction(data.allTransaction)
        }
       }catch(err){
        toast.error("unable to fetch transaction")
        setAllTransaction(null)
       }
    }
    fetchAllTransaction()
  },[])

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 items-center gap-4 bg-gray-50 p-4 border-b border-gray-200">
        <p className="text-lg font-medium text-gray-700">User ID</p>
        <p className="text-lg font-medium text-gray-700 text-center">UTR</p>
        <p className="text-lg font-medium text-gray-700">Status</p>
        <p className="text-lg font-medium text-gray-700">total amount</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
        <p className="text-lg font-medium text-gray-700">Actions</p>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {allTransaction && allTransaction.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-6 items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
           
           {/* userId */}
            <p className="text-gray-800 text-sm font-medium">{transaction.userId}</p>
           
           {/* UTR */}
            <p className="text-gray-600 text-sm text-center">{transaction.UTR}</p>
            
            {/* Status with colored indicator */}
            <div className="flex items-center text-sm">
              <span className={`h-2 w-2 rounded-full mr-2 ${
                transaction.status === 'pending' ? 'bg-yellow-500' :
                transaction.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="capitalize">{transaction.status}</span>
            </div>
            
            {/* total amount */}
              
              <input onChange={(e)=>{setTotalAmount(e.target.value)}} value={totalAmount}  className="border border-gray-500 w-[90px] rounded-md" placeholder="₹0.00" type="number" name="" id="" />

             {/* Success Button */}
             <button onClick={()=>{handelApprove(transaction.userId)}} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium w-[100px]">
              Approve
            </button>

            {/* Reject Button */}
            <button onClick={handelReject} className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium w-[100px]">
              Reject
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Transaction;