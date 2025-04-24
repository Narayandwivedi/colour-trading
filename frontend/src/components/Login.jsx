import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("login");

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-blue-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          {state === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="text-white flex items-center gap-2 mb-1">
            <i className="fa-solid fa-envelope text-blue-400"></i>Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password - signup only */}
        {state === "signup" && (
          <>
            <div className="mb-4">
              <label className="text-white flex items-center gap-2 mb-1">
                <i className="fa-solid fa-lock text-blue-400"></i>Set Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Set your password"
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-white flex items-center gap-2 mb-1">
                <i className="fa-solid fa-lock text-blue-400"></i>Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-white flex items-center gap-2 mb-1">
                <i className="fa-solid fa-message text-blue-400"></i>Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                name="inviteCode"
                placeholder="Enter invite code"
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {
            state==="login"&&(
                <div className="mb-4">
              <label className="text-white flex items-center gap-2 mb-1">
                <i className="fa-solid fa-lock text-blue-400"></i>Password
              </label>
              <input
                type="password"
                id="Password"
                name="Password"
                placeholder="password"
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            )
        }

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
          {state === "signup" ? "Sign Up" : "Login"}
        </button>

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
