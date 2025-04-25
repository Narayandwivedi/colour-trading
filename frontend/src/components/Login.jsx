import React, { useContext, useState } from "react";
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
  const BACKEND_URL = `https://colour-trading-server.vercel.app`
  const navigate = useNavigate();

  async function handleLogin(){
    if(!email || !email.trim() || !password || !password.trim()){
        return toast.error("email or password is missng")
    }
    try{
      const {data} = await axios.post(`${BACKEND_URL}/api/users/login`,{
        email:email,
        password:password
      },{
        withCredentials:true
      })
      if(data.success){
        navigate("/")
        toast.success("user logged in successfully")

      }
     }catch(err){
      if(err.response.data){
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
      password
    },
    {
      withCredentials:true
    }
  )
  if(data.success){
    navigate("/")
    toast.success(data.message)
    
  }
  }catch(err){

    if(err.response.data){
      toast.error(err.response.data.message)
    }

  }
    
  }


  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-blue-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          {state === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Full name  - only for signup*/}
        {
          state==="signup"&&(
            <div className="mb-4">
          <label className="text-white flex items-center gap-2 mb-1">
            <i className="fa-solid fa-envelope text-blue-400"></i>Full Name
          </label>
          <input
            onChange={(e)=>{setFullName(e.target.value)}}
            value={fullName}
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
          )
        }

        {/* Email */}
        <div className="mb-4">
          <label className="text-white flex items-center gap-2 mb-1">
            <i className="fa-solid fa-envelope text-blue-400"></i>Email
          </label>
          <input
            onChange={(e)=>{setEmail(e.target.value)}}
            value={email}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
         
            <div className="mb-4">
              <label className="text-white flex items-center gap-2 mb-1">
                <i className="fa-solid fa-lock text-blue-400"></i>{state==='signup'?"Set Password":"password"}
              </label>
              <input
                onChange={(e)=>{setPassword(e.target.value)}}
                value={password}
                type="password" 
                id="password"
                name="password"
                placeholder={state==="login"?"Enter password":"Set your password"}
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* invite code - signup only */}

            {state==="signup"&&(
               <div className="mb-4">
               <label className="text-white flex items-center gap-2 mb-1">
                 <i className="fa-solid fa-message text-blue-400"></i>Invite Code
               </label>
               <input
                 onChange={(e)=>{setInviteCode(e.target.value)}}
                 value={inviteCode}
                 type="text"
                 id="inviteCode"
                 name="inviteCode"
                 placeholder="Enter invite code"
                 className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
            )}

        {/* login and signup button */}

        {
          state==="login"?(
          <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
          Login
        </button>
          ):<button onClick={handleSignup} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
          Signup
        </button>

        }

        <p className="text-center text-white mt-4">
          {state === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setState("login")}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New user?{" "}
              <button
                onClick={() => setState("signup")}
                className="text-blue-400 hover:underline"
              >
                Sign up here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
