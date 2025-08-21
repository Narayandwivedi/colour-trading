import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Mail, Clock, HelpCircle, Shield, Zap, Users, CheckCircle } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function CustomerSupportPage() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const handleChatNow = () => {
    navigate('/chat');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:winners11assist@gmail.com';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 pb-20">
        {/* Enhanced Header */}
        <div className="px-4 pt-4 pb-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Customer Support
            </h1>
            <p className="text-gray-600 text-sm">Hi {userData?.fullName?.split(' ')[0] || 'User'}! 👋 We're here to help</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-6">
          {/* Support Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Fast Response</h3>
                <p className="text-xs text-gray-600">Under 5 minutes</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Secure Help</h3>
                <p className="text-xs text-gray-600">Your data is safe</p>
              </div>
            </div>
          </div>

          {/* Live Chat - Primary CTA */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-600/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-5 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Live Chat Support</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm text-white opacity-90">Online • Response in &lt; 5 min</span>
                  </div>
                </div>
              </div>
              
              <p className="text-white text-sm opacity-90 mb-6 leading-relaxed">
                Get instant help from our support team.
              </p>
              
              <button
                onClick={handleChatNow}
                className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat Now</span>
              </button>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-600/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-5 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white bg-opacity-5 rounded-full -ml-6 -mb-6"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-white" />
                <h2 className="font-bold text-white text-lg">Email Support</h2>
              </div>
              
              <div className="space-y-3">
                <p className="text-white text-sm opacity-90">For detailed inquiries or complaints</p>
                
                <div className="bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <p className="text-xs text-white opacity-75 mb-1">Email Address</p>
                  <p className="text-sm text-white font-mono break-all">winners11assist@gmail.com</p>
                </div>
                
                <button
                  onClick={handleEmail}
                  className="w-full bg-white text-blue-800 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-teal-600" />
              <h2 className="font-bold text-gray-800 text-lg">Support Hours</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Live Chat</span>
                </div>
                <span className="text-teal-600 font-semibold text-sm">9:00 AM - 12:00 AM</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Email Support</span>
                </div>
                <span className="text-gray-600 font-semibold text-sm">24/7 Response</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white">
            <h2 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>For Faster Support</span>
            </h2>
            
            <ul className="space-y-2 text-sm opacity-95">
              <li className="flex items-start space-x-2">
                <span className="text-green-300">•</span>
                <span>Include screenshots of any issues</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-300">•</span>
                <span>Mention your username or email ID</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-300">•</span>
                <span>Describe the problem clearly</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-300">•</span>
                <span>Be patient - we respond quickly!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}