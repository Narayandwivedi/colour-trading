import React, {useContext, useState } from 'react'
import axios from 'axios'
import {AppContext} from '../context/AppContext'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import { Mail, Lock, Key } from 'lucide-react'

const ResetPass = () => {

    const [email , setEmail] = useState('')
    const [newPass , setNewPass] = useState('')
    const [otp , setOtp] = useState('')
    const [isOtpFormOpen , setOtpFormOpen] = useState(false)

    const navigate = useNavigate();

    const {BACKEND_URL} = useContext(AppContext)
    
    const getOtp = async()=>{
       try{
         if(!email || !email.trim()){
          return toast.error("enter email id")
        }
       const {data} = await axios.post(`${BACKEND_URL}/api/users/get-otp`,{
          email
        })

        console.log(data);
        

        if(data.success){
          toast.success(data.message)
          setOtpFormOpen(true)
        } 
       }catch(err){
        console.log(err);
        toast.error(err.message || 'some error while generating otp try again')
       }
        
    }

    const submitOtp = async()=>{
      
       try{
         if(!newPass || !otp || !email ){
          return toast.error("missing pass otp or email try again")
        }
       const {data} =  await axios.post(`${BACKEND_URL}/api/users/submit-otp`,{
          email,newPass,otp
        })
        if(data.success){
          navigate("/login")
          toast.success(data.message)
        }
       }catch(err){
        toast.error(err.message || error)
       }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />
      
      {/* Ocean glow effects */}
      <div className="absolute -top-8 -left-8 w-64 h-64 bg-cyan-400/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-400/10 blur-3xl rounded-full"></div>
      
      {/* Stunning aqua-themed navbar */}
      <nav className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-4 max-w-[440px] mx-auto backdrop-blur-sm border-b border-cyan-600/50">
        {/* Winner Club Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              className="drop-shadow-2xl"
            >
              {/* Trophy Base */}
              <circle cx="24" cy="24" r="20" fill="url(#aquaGradient)" stroke="#22D3EE" strokeWidth="2"/>
              
              {/* Trophy Cup */}
              <path 
                d="M16 18 L32 18 L30 28 L18 28 Z" 
                fill="#67E8F9" 
                stroke="#06B6D4" 
                strokeWidth="1"
              />
              
              {/* Trophy Handles */}
              <path 
                d="M14 20 Q12 20 12 22 Q12 24 14 24" 
                fill="none" 
                stroke="#22D3EE" 
                strokeWidth="2"
              />
              <path 
                d="M34 20 Q36 20 36 22 Q36 24 34 24" 
                fill="none" 
                stroke="#22D3EE" 
                strokeWidth="2"
              />
              
              {/* Trophy Base */}
              <rect x="20" y="28" width="8" height="4" fill="#0891B2" rx="1"/>
              <rect x="18" y="32" width="12" height="3" fill="#0E7490" rx="1"/>
              
              {/* Star */}
              <path 
                d="M24 12 L25.5 16.5 L30 16.5 L26.5 19.5 L28 24 L24 21 L20 24 L21.5 19.5 L18 16.5 L22.5 16.5 Z" 
                fill="#FDE047"
                stroke="#FACC15"
                strokeWidth="0.5"
              />
              
              <defs>
                <linearGradient id="aquaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE"/>
                  <stop offset="50%" stopColor="#67E8F9"/>
                  <stop offset="100%" stopColor="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              WINNER
            </h1>
            <p className="text-sm font-medium text-cyan-200 -mt-1 tracking-wider">
              CLUB
            </p>
          </div>
        </div>
      </nav>

      {/* Reset Password Form Container */}
      <div className="flex items-center justify-center px-4 py-8 relative z-10 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          
          {/* Header with ocean theme */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full mb-4 shadow-xl">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-white">
                <path d="M16 2 L18 6 L22 6 L19 9 L20 13 L16 11 L12 13 L13 9 L10 6 L14 6 Z M16 14 L18 18 L22 18 L19 21 L20 25 L16 23 L12 25 L13 21 L10 18 L14 18 Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="text-gray-800 text-2xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {!isOtpFormOpen ? "Reset Password" : "Verify & Set New Password"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {!isOtpFormOpen ? "Enter your email to receive OTP" : "Enter the OTP and set your new password"}
            </p>
          </div>

          {/* Generate OTP Form */}
          {!isOtpFormOpen && (
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="text-gray-700 flex items-center gap-2 mb-3 font-medium text-sm">
                  <Mail className="w-4 h-4 text-cyan-500" />Email Address
                </label>
                <input
                  placeholder="Enter your email to find account"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-base"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
                  type="email"
                />
              </div>

              {/* Get OTP Button */}
              <button 
                onClick={getOtp}
                className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transform text-lg"
              >
                Send OTP
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Submit OTP Form */}
          {isOtpFormOpen && (
            <div className="space-y-6">
              {/* New Password Input */}
              <div>
                <label className="text-gray-700 flex items-center gap-2 mb-3 font-medium text-sm">
                  <Lock className="w-4 h-4 text-cyan-500" />New Password
                </label>
                <input
                  value={newPass}
                  onChange={(e) => {setNewPass(e.target.value)}}
                  placeholder="Enter your new password"
                  type="password"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-base"
                />
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-gray-700 flex items-center gap-2 mb-3 font-medium text-sm">
                  <Key className="w-4 h-4 text-cyan-500" />OTP Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => {setOtp(e.target.value)}}
                  placeholder="Enter OTP sent to your email"
                  type="text"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-base"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={submitOtp}
                className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transform text-lg"
              >
                Change Password
              </button>

              {/* Back button */}
              <div className="text-center">
                <button
                  onClick={() => setOtpFormOpen(false)}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors hover:underline"
                >
                  ← Back to Email Entry
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ResetPass