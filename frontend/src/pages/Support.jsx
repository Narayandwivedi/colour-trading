import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Mail, Clock, HeadphonesIcon } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function CustomerSupportPage() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const handleChatNow = () => {
    navigate('/chat');
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = 'mailto:winnersclubsofficial@gmail.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 mx-auto max-w-[440px] relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Ocean-themed navbar */}
      <Navbar/>

      {/* Header with greeting */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 shadow-2xl px-4 py-6 backdrop-blur-sm border-b border-cyan-600/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Customer Support</h1>
            <p className="text-cyan-200 text-sm">Hi {userData?.fullName?.split(' ')[0] || 'User'} 👋</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-400 to-teal-500 p-3 rounded-xl shadow-lg">
            <HeadphonesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Live Chat Support */}
        <div className="bg-gradient-to-br from-teal-800 via-cyan-800 to-emerald-800 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-cyan-600/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">Live Chat</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm text-white opacity-90">Online now</span>
                </div>
              </div>
            </div>
            
            <p className="text-white text-sm opacity-90 mb-6 leading-relaxed">
              Get instant help from our support team. Average response time: under 5 minutes
            </p>
            
            <button
              onClick={handleChatNow}
              className="w-full bg-white text-teal-800 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Live Chat</span>
            </button>
          </div>
        </div>

        {/* Other Contact Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Phone className="w-5 h-5 text-cyan-200" />
            <h3 className="font-bold text-white text-lg">Other Ways to Reach Us</h3>
          </div>


          {/* Email */}
          <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-xl p-4 shadow-lg border border-cyan-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-teal-800">Email Support</div>
                  <div className="text-xs text-teal-600">winnersclubsofficial@gmail.com</div>
                </div>
              </div>
              <button
                onClick={handleEmail}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
              >
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-2xl p-6 border border-cyan-200/50 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-teal-600 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-teal-800 text-base">Support Hours</h3>
              <p className="text-teal-600 text-sm">We're here to help</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-teal-700 font-medium">Live Chat</span>
              </div>
              <span className="text-green-600 font-semibold">9 AM - 12 AM</span>
            </div>
            
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-teal-700 font-medium">Email Support</span>
              </div>
              <span className="text-purple-600 font-semibold">24/7</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-xl p-4 shadow-lg border border-cyan-200/50">
          <h2 className="text-lg font-semibold text-teal-800 mb-3">📋 Before Contacting Support:</h2>
          <ul className="list-disc list-inside text-teal-700 space-y-2 text-sm">
            <li><span className="font-medium text-cyan-800">Take a screenshot</span> of the problem you're facing</li>
            <li><span className="font-medium text-cyan-800">Send a clear message</span> in English or Hindi</li>
            <li>Mention your <span className="font-medium text-cyan-800">username</span> or <span className="font-medium text-cyan-800">email</span></li>
            <li><span className="font-medium text-cyan-800">Do not spam</span> — we respond as fast as we can</li>
          </ul>
        </div>
      </div>
    </div>
  );
}