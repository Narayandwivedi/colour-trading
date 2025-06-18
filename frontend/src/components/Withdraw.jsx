import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'


const Withdraw = () => {
    const { withdrawableBalance, balance, userData , BACKEND_URL } = useContext(AppContext)
    const [amount , setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('') // 'bank' or 'upi'
    const navigate = useNavigate()


    const handleWithdraw = async()=>{
        const parsedAmount = Number(amount)
        
        if(!paymentMethod){
            return toast.error('Please select a payment method')
        }
        
        if(!userData.isBankAdded && !userData.isUpiAdded){
            return toast.error('add bank account or UPI to withdraw')
        }
        
        // Check if selected method is actually added by user
        if(paymentMethod === 'bank' && !userData.isBankAdded){
            return toast.error('Please add bank account first')
        }
        
        if(paymentMethod === 'upi' && !userData.isUpiAdded){
            return toast.error('Please add UPI ID first')
        }
        
        if(!amount || parsedAmount<300){
            return toast.error('invalid withdrawal amount')
        }

        if(amount>userData.withdrawableBalance){
            return toast.error("insufficient balance")
        }
        
        const {data} = await axios.post(`${BACKEND_URL}/api/transaction/withdraw`,{
            userId : userData._id,
            amount : parsedAmount,
            paymentMethod: paymentMethod
        })
        
        if(data.success){
            toast.success('Withdrawal request submitted successfully!')
            
            // Reset form
            setAmount('')
            setPaymentMethod('')
        } else {
            toast.error(data.message || 'Withdrawal failed')
        }
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please login to access the withdrawal page and manage your funds.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 pt-5 pb-10 px-4'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Withdraw Funds</h1>
                <p className='text-gray-500 text-sm'>Transfer money to your bank account or UPI</p>
            </div>

            {/* Balance Cards */}
            <div className='grid grid-cols-1 gap-4 mb-6'>
                {/* Total Balance Card */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl shadow-md text-white'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-full'>
                                <i className="fa-solid fa-wallet text-xl"></i>
                            </div>
                            <div>
                                <p className='text-sm opacity-90'>Total Balance</p>
                                <h2 className='text-xl font-bold'>₹{balance?.toLocaleString() || '0'}</h2>
                            </div>
                        </div>
                        <i className="fa-solid fa-ellipsis-vertical opacity-70"></i>
                    </div>
                </div>

                {/* Withdrawable Balance Card */}
                <div className='bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-xl shadow-md text-white'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-full'>
                                <i className="fa-solid fa-money-bill-wave text-xl"></i>
                            </div>
                            <div>
                                <p className='text-sm opacity-90'>Withdrawable Balance</p>
                                <h2 className='text-xl font-bold'>₹{withdrawableBalance?.toLocaleString() || '0'}</h2>
                            </div>
                        </div>
                        <i className="fa-solid fa-info-circle opacity-70" title="This is the amount you can withdraw immediately"></i>
                    </div>
                </div>
            </div>

            {/* Payout Methods */}
            <div className='mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-3'>Payout Methods</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Bank Account */}
                    {userData.isBankAdded ? (
                        <div 
                            className={`bg-white p-4 rounded-xl shadow-sm border ${paymentMethod === 'bank' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-200'} cursor-pointer transition-all`}
                            onClick={() => setPaymentMethod('bank')}
                        >
                            <div className='flex flex-col items-center'>
                                <div className='bg-blue-100 p-3 rounded-full mb-3 text-blue-600'>
                                    <i className="fa-solid fa-building-columns text-2xl"></i>
                                </div>
                                <p className='text-gray-700 font-medium'>Bank Account</p>
                                <p className='text-xs text-green-600 mt-1'>
                                    Added: ••••{userData.accountNumber?.slice(-4)}
                                </p>
                                <Link 
                                    to="/editbank" 
                                    className='text-xs text-blue-600 mt-2 hover:underline'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Change Account
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Link to="/addbank">
                            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-blue-200'>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-blue-100 p-3 rounded-full mb-3 text-blue-600'>
                                        <i className="fa-solid fa-building-columns text-2xl"></i>
                                    </div>
                                    <p className='text-gray-700 font-medium'>Bank Account</p>
                                    <p className='text-xs text-gray-400 mt-1'>Add new account</p>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* UPI ID */}
                    {userData.isUpiAdded ? (
                        <div 
                            className={`bg-white p-4 rounded-xl shadow-sm border ${paymentMethod === 'upi' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200'} cursor-pointer transition-all`}
                            onClick={() => setPaymentMethod('upi')}
                        >
                            <div className='flex flex-col items-center'>
                                <div className='bg-purple-100 p-3 rounded-full mb-3 text-purple-600'>
                                    <i className="fa-solid fa-indian-rupee-sign text-2xl"></i>
                                </div>
                                <p className='text-gray-700 font-medium'>UPI ID</p>
                                <p className='text-xs text-green-600 mt-1'>
                                    Added: {userData.upi}
                                </p>
                                <Link 
                                    to="/editupi" 
                                    className='text-xs text-blue-600 mt-2 hover:underline'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Change UPI
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Link to="/addupi">
                            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-purple-200'>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-purple-100 p-3 rounded-full mb-3 text-purple-600'>
                                        <i className="fa-solid fa-indian-rupee-sign text-2xl"></i>
                                    </div>
                                    <p className='text-gray-700 font-medium'>UPI ID</p>
                                    <p className='text-xs text-gray-400 mt-1'>Add new UPI</p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Withdrawal Form */}
            <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>Withdrawal Amount</h2>
                
                <div className='mb-4'>
                    <label className='block text-gray-500 text-sm mb-2'>Payment Method</label>
                    <div className='flex gap-3 mb-4'>
                        <button
                            type="button"
                            className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'bank' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                            onClick={() => setPaymentMethod('bank')}
                            disabled={!userData.isBankAdded}
                        >
                            <i className="fa-solid fa-building-columns mr-2"></i>
                            Bank Transfer
                            {userData.isBankAdded && paymentMethod === 'bank' && (
                                <i className="fa-solid fa-check ml-2 text-blue-600"></i>
                            )}
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'upi' ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                            onClick={() => setPaymentMethod('upi')}
                            disabled={!userData.isUpiAdded}
                        >
                            <i className="fa-solid fa-indian-rupee-sign mr-2"></i>
                            UPI Transfer
                            {userData.isUpiAdded && paymentMethod === 'upi' && (
                                <i className="fa-solid fa-check ml-2 text-purple-600"></i>
                            )}
                        </button>
                    </div>
                    {paymentMethod && (
                        <p className='text-xs text-green-600 mb-3'>
                            Selected: {paymentMethod === 'bank' 
                                ? `Bank Account (••••${userData.accountNumber?.slice(-4)})` 
                                : `UPI ID (${userData.upi})`}
                        </p>
                    )}
                </div>
                
                <div className='mb-4'>
                    <label className='block text-gray-500 text-sm mb-2'>Enter amount (₹)</label>
                    <input
                        type="number"
                        placeholder='e.g. 500'
                        className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                        value={amount}
                        onChange={(e)=>{setAmount(e.target.value)}}
                    />
                    <p className='text-xs text-gray-400 mt-1'>
                        Minimum: ₹300 
                    </p>
                </div>
                <button 
                    onClick={handleWithdraw} 
                    disabled={!paymentMethod || !amount}
                    className={`w-full py-3 rounded-lg font-medium shadow-md transition-all ${paymentMethod && amount ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                    Withdraw Now
                </button>
            </div>

            {/* Withdrawal Rules */}
            <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                    <i className="fa-solid fa-info-circle text-blue-500"></i>
                    Withdrawal Rules
                </h2>
                <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                        <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xs"></i>
                        <span className='text-gray-600'>Minimum withdrawal amount is ₹300</span>
                    </li>
                    <li className='flex items-start gap-2'>
                        <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xs"></i>
                        <span className='text-gray-600'>Maximum 3 withdrawals allowed per day</span>
                    </li>
                    <li className='flex items-start gap-2'>
                        <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xs"></i>
                        <span className='text-gray-600'>Withdrawals processed between 9:00AM to 12:00PM</span>
                    </li>
                    <li className='flex items-start gap-2'>
                        <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xs"></i>
                        <span className='text-gray-600'>Deposit balance is not withdrawable</span>
                    </li>
                    <li className='flex items-start gap-2'>
                        <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xs"></i>
                        <span className='text-gray-600'>Please select either Bank Transfer or UPI Transfer method</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Withdraw