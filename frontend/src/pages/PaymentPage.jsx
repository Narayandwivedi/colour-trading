import React, { useContext, useState } from 'react';
import UPIQRCode from '../components/UPIQRCODE';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentPage = () => {
  const [utr, setUtr] = useState('');
  const [error, setError] = useState('');
  const {finalDepositAmt , setFinalDepositAmt ,userData , BACKEND_URL} = useContext(AppContext)

  async function handleAddTransaction() {
    if (!userData) {
      return toast.error("Please login to continue");
      }
      if(!utr || utr.length<10){
        return toast.error("invalid utr")
    }
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/transaction`, {
        userId: userData._id,
        UTR: utr,
        
      });  
      if (data.success) {
        console.log(finalDepositAmt);
        toast.success(data.message);
        setUtr('');
        setFinalDepositAmt(null)
      }
    } catch (err) {
      console.log(err.message);
      
      toast.error(err.response?.data?.message || "Error processing deposit");
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Make Payment</h2>
        <p className="text-gray-600 mb-6">Scan the QR code below to pay</p>

        <div className="flex justify-center mb-6">
          <UPIQRCode amount={finalDepositAmt} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAddTransaction(); }} >
          <label className="block text-left mb-1 text-gray-700 font-medium">
            Enter UTR / Transaction ID
          </label>
          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="enter utr"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit UTR
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default PaymentPage;
