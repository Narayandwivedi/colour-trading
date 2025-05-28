import React, { useContext, useState } from 'react';
import UPIQRCode from '../components/UPIQRCODE';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentPage = () => {
  const [utr, setUtr] = useState('');
  const [error, setError] = useState('');
  const { finalDepositAmt, setFinalDepositAmt, userData, BACKEND_URL } = useContext(AppContext);

  async function handleAddTransaction() {
    if (!userData) {
      return toast.error("Please login to continue");
    }
    if (!utr || utr.length < 10) {
      return toast.error("Invalid UTR");
    }

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/transaction`, {
        userId: userData._id,
        UTR: utr,
      });

      if (data.success) {
        toast.success(data.message);
        setUtr('');
        setFinalDepositAmt(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error processing deposit");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md text-center animate-fade-in">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">Make a Payment</h2>
        <p className="text-gray-600 mb-6">Scan the QR code below to pay</p>

        <div className="bg-gray-100 rounded-xl p-4 mb-6 border shadow-inner">
          <UPIQRCode amount={finalDepositAmt} />
          {finalDepositAmt && (
            <p className="mt-2 text-sm text-gray-700 font-medium">
              Amount: ₹{finalDepositAmt}
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
          className="text-left"
        >
          <label className="block text-sm text-gray-700 font-semibold mb-1">
            UTR / Transaction ID
          </label>
          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="e.g. 1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full mt-5 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Submit UTR
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
