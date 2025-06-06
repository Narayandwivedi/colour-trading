import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const Withdraw = () => {
    const { withdrawableBalance, setWithdrawableBalance , balance } = useContext(AppContext)

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
                                <h2 className='text-xl font-bold'>{balance}</h2>
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
                                <h2 className='text-xl font-bold'>₹{withdrawableBalance}</h2>
                            </div>
                        </div>
                        <i className="fa-solid fa-info-circle opacity-70"></i>
                    </div>
                </div>
            </div>

            {/* Payout Methods */}
            <div className='mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-3'>Payout Methods</h2>
                <div className='grid grid-cols-2 gap-4'>
                    {/* Bank Account */}
                   
                   <Link to={"/addbank"}>
                     <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-blue-100 p-3 rounded-full mb-3 text-blue-600'>
                                <i className="fa-solid fa-building-columns text-2xl"></i>
                            </div>
                            <p className='text-gray-700 font-medium'>Bank Account</p>
                            <p className='text-xs text-gray-400 mt-1'>Add new account</p>
                        </div>
                    </div>
                   </Link>

                    {/* UPI ID */}

                    <Link to={'/addupi'}>
                        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-purple-100 p-3 rounded-full mb-3 text-purple-600'>
                                <i className="fa-solid fa-indian-rupee-sign text-2xl"></i>
                            </div>
                            <p className='text-gray-700 font-medium'>UPI ID</p>
                            <p className='text-xs text-gray-400 mt-1'>Add new UPI</p>
                        </div>
                    </div>
                    </Link>
                    
                </div>
            </div>

            {/* Withdrawal Form */}
            <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>Withdrawal Amount</h2>
                <div className='mb-4'>
                    <label className='block text-gray-500 text-sm mb-2'>Enter amount (₹)</label>
                    <input
                        type="number"
                        placeholder='e.g. 500'
                        className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                    />
                </div>
                <button className='w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all'>
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
                </ul>
            </div>
        </div>
    )
}

export default Withdraw