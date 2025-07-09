import React from "react";
import Navbar from "../components/Navbar";

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 pb-20 mx-auto max-w-[440px] relative">
      {/* Background for larger screens */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-emerald-950 -z-10 w-screen" />

      {/* Ocean-themed navbar */}
      <Navbar/>

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