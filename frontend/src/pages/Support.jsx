import React from "react";

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 mx-auto max-w-[440px] relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Ocean-themed navbar */}
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

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 mt-8">
        <div className="max-w-xl w-full bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 shadow-2xl rounded-2xl p-6 md:p-10 border border-cyan-200/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent mb-4 text-center">
            🛠️ Customer Support
          </h1>
          <p className="text-teal-700 text-center mb-6 font-medium">
            Need help or facing an issue? We're here to assist you!
          </p>

          <div className="bg-gradient-to-r from-cyan-100 via-teal-100 to-emerald-100 border-2 border-cyan-300/60 rounded-xl p-4 text-center mb-6 shadow-lg">
            <p className="text-lg font-semibold text-cyan-800 mb-2">Contact us on Telegram:</p>
            <a
              href="https://t.me/Winnersclubsupport"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:via-teal-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              📲 t.me/Winnersclubsupport
            </a>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-teal-800 mb-3">📋 Instructions Before Messaging:</h2>
            <ul className="list-disc list-inside text-teal-700 space-y-3 bg-white/50 rounded-lg p-4 border border-teal-200/50">
              <li><span className="font-medium text-cyan-800">Take a screenshot</span> of the problem you're facing.</li>
              <li><span className="font-medium text-cyan-800">Send a clear message</span> in either <strong>English</strong> or <strong>Hindi</strong>.</li>
              <li>Mention your <span className="font-medium text-cyan-800">username</span> or <span className="font-medium text-cyan-800">email</span> (if applicable).</li>
              <li><span className="font-medium text-cyan-800">Do not spam</span> — we respond as fast as we can.</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 border-2 border-emerald-300/60 rounded-xl p-4 text-center shadow-lg">
            <p className="text-emerald-800 font-medium">⏱ You'll get a reply within <strong>2 hours</strong> during working hours.</p>
          </div>

          <p className="text-center text-teal-600 text-sm mt-6 font-medium">— Winners Club Support Team</p>
        </div>
      </div>
    </div>
  );
}