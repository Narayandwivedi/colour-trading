import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBalance = () => {
  const { userData, BACKEND_URL } = useContext(AppContext);
  const [UTR, setUTR] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isCustomAmount, setIsCustomAmount] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  
  const navigate = useNavigate();


  const depositOptions = [100, 300, 500, 1000];

  const handlePay = () => {
    const finalAmount = isCustomAmount ? parseInt(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount < 100) {
      toast.error('Please enter a valid amount (minimum ₹100)');
      return;
    }
    navigate("/payment")
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Money</h1>
        <p className="text-gray-600 mb-6">Choose or enter an amount to deposit</p>

        {/* Amount Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {depositOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setIsCustomAmount(false);
              }}
              className={`py-3 px-4 rounded-lg border-2 text-center font-semibold transition-all duration-200 ${
                selectedAmount === amount && !isCustomAmount
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Toggle */}
        <div className="mb-6">
          <label className="inline-flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={isCustomAmount}
              onChange={() => {
                setIsCustomAmount(!isCustomAmount);
                if (!isCustomAmount) setSelectedAmount(null);
              }}
              className="h-4 w-4"
            />
            <span className="text-gray-700 font-medium">Enter Custom Amount</span>
          </label>

          {isCustomAmount && (
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="Minimum ₹100"
                min="100"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {customAmount && parseInt(customAmount) < 100 && (
                <p className="text-red-500 text-sm mt-1">Minimum deposit is ₹100</p>
              )}
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          Pay
        </button>

        {/* Payment Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h3>
          <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
            <li>Minimum deposit is ₹100</li>
            <li>Transfer the money using any UPI app</li>
            <li>Submit the correct UTR number</li>
            <li>Deposits are processed within 15–30 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;
