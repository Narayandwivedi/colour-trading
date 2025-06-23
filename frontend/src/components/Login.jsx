import React, { useContext, useEffect, useState } from "react";
import {toast } from 'react-toastify';
import axios from "axios"
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("login");
  const [fullName , setFullName] = useState("")
  const [email , setEmail] = useState("");
  const [password ,setPassword]= useState("")
  const [inviteCode , setInviteCode] = useState("");
  const navigate = useNavigate();

  const {setBalance , BACKEND_URL, setUserData} = useContext(AppContext);

  async function handleLogin(){
   
    try{

       if(!email || !email.trim() || !password || !password.trim()){
        return toast.error("email or password is missing")
    }
      const {data} = await axios.post(`${BACKEND_URL}/api/users/login`,{
        email:email,
        password:password
      },{
        withCredentials:true
      })
      if(data.success){
        setUserData(data.userData)
        setBalance(data.userData.balance)
          navigate("/")
          toast.success("user logged in successfully")

      }
     }catch(err){
      console.log(err.message);      
      if(err.response){
        console.log("error");
        
        return toast.error(err.response.data.message)
      }
      toast.error(err.message)
     }
  }

  async function handleSignup(){
    if( !fullName || !fullName.trim() || !email || !email.trim() || !password || !password.trim()){
      return toast.error(" name , email or password is missng")
  }

  try{
    const {data} = await axios.post(`${BACKEND_URL}/api/users/signup`,{
      fullName,
      email,
      password,
      referedBy:inviteCode
    },
    {
      withCredentials:true
    }
  )
  if(data.success){
    // setState("login")
    //  console.log(data);
    
    setUserData(data.userId)
    navigate("/")
    toast.success(data.message)
    
  }
  }catch(err){

    if(err.response.data){
      toast.error(err.response.data.message)
    }
 }}


  return (
    <div className="h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 relative overflow-hidden">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />
      
      {/* Ocean glow effects */}
      <div className="absolute -top-8 -left-8 w-64 h-64 bg-cyan-400/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-400/10 blur-3xl rounded-full"></div>
      
      {/* Compact aqua-themed navbar */}
      <nav className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-2 max-w-[440px] mx-auto backdrop-blur-sm border-b border-cyan-600/50">
        {/* Winner Club Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg 
              width="40" 
              height="40" 
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              WINNERS
            </h1>
            <p className="text-xs font-medium text-cyan-200 -mt-1 tracking-wider">
              CLUB
            </p>
          </div>
        </div>
      </nav>

      {/* Login Form Container */}
      <div className="flex items-center justify-center px-4 py-4 relative z-10 h-[calc(100vh-60px)]">
        <div className="w-full max-w-lg bg-gradient-to-br from-teal-800/80 via-cyan-800/80 to-emerald-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-cyan-600/30">
          {/* Compact Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full mb-2 shadow-xl">
              <svg width="24" height="24" viewBox="0 0 32 32" className="text-white">
                <path d="M16 4 L20 12 L28 12 L22 18 L24 28 L16 22 L8 28 L10 18 L4 12 L12 12 Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              {state === "signup" ? "Join Winner Club" : "Welcome Back"}
            </h2>
            <p className="text-cyan-200 text-xs mt-1">
              {state === "signup" ? "Create your account to start winning" : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Full name - only for signup */}
          {state === "signup" && (
            <div className="mb-4">
              <label className="text-cyan-200 flex items-center gap-2 mb-2 font-medium text-xs">
                <i className="fa-solid fa-user text-cyan-400"></i>Full Name
              </label>
              <input
                onChange={(e) => {setFullName(e.target.value)}}
                value={fullName}
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-cyan-900/50 border border-cyan-600/30 text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all text-sm"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-cyan-200 flex items-center gap-2 mb-2 font-medium text-xs">
              <i className="fa-solid fa-envelope text-cyan-400"></i>Email
            </label>
            <input
              onChange={(e) => {setEmail(e.target.value)}}
              value={email}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-cyan-900/50 border border-cyan-600/30 text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-cyan-200 flex items-center gap-2 mb-2 font-medium text-xs">
              <i className="fa-solid fa-lock text-cyan-400"></i>{state === 'signup' ? "Set Password" : "Password"}
            </label>
            <input
              onChange={(e) => {setPassword(e.target.value)}}
              value={password}
              type="password" 
              id="password"
              name="password"
              placeholder={state === "login" ? "Enter password" : "Set your password"}
              className="w-full px-4 py-3 rounded-lg bg-cyan-900/50 border border-cyan-600/30 text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all text-sm"
            />
          </div>

          {/* Forgot Password - only show for login */}
          {state === "login" && (
            <div className="mb-4 text-right">
              <button
                onClick={()=>{ navigate("/reset-pass")}}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Invite code - signup only */}
          {state === "signup" && (
            <div className="mb-4">
              <label className="text-cyan-200 flex items-center gap-2 mb-2 font-medium text-xs">
                <i className="fa-solid fa-gift text-cyan-400"></i>Invite Code
              </label>
              <input
                onChange={(e) => {setInviteCode(e.target.value)}}
                value={inviteCode}
                type="text"
                id="inviteCode"
                name="inviteCode"
                placeholder="Enter invite code (optional)"
                className="w-full px-4 py-3 rounded-lg bg-cyan-900/50 border border-cyan-600/30 text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all text-sm"
              />
            </div>
          )}

          {/* Login and signup button */}
          {state === "login" ? (
            <button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transform text-sm mb-4"
            >
              Login to Winner Club
            </button>
          ) : (
            <button 
              onClick={handleSignup} 
              className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transform text-sm mb-4"
            >
              Join Winner Club
            </button>
          )}

          <p className="text-center text-cyan-200 text-sm">
            {state === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setState("login")}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                New to Winner Club?{" "}
                <button
                  onClick={() => setState("signup")}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                >
                  Sign up here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;