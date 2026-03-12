"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSeller } from "../api/auth";
import sellerLogo from "../assets/imgs/seller_Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = {
        email: email,
        password: password,
        user_type: "seller",
      };

      const data = await loginSeller(payload);

      if (data.status === true || data.success === true) {
        const token = data.token || data.access_token || (data.user && data.user.token);

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user_type", "seller");
          localStorage.setItem("user_info", JSON.stringify(data.user || data.data));

          window.location.href = "/seller/dashboard";
        } else {
          setError("Login successful but token not received.");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error Details:", err.response || err);
      const errMsg = err.response?.data?.message || "Server connection failed. Please check your internet or API.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 flex flex-col">
        <div className="flex flex-col md:flex-row items-center w-full">

          {/* Left Side - Logo */}
          <div className="w-full md:w-1/2 flex justify-center p-4">
            <img src={sellerLogo} alt="Seller Logo" className="w-[320px] h-auto" />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-6">
            <h1 className="text-4xl font-light mb-6 border-b pb-2 text-right pr-4 text-gray-700">
              Kalkideals
            </h1>
            <h2 className="font-semibold text-lg mb-3 text-gray-800">Seller Account Login</h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-2 rounded text-sm border border-red-100 text-center">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white py-2 rounded-md font-semibold transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 shadow-md"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New seller?{" "}
            <button
              onClick={() => navigate("/seller/registration")}
              className="text-blue-600 font-bold underline hover:text-blue-800"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}