"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { loginSeller } from "../api/auth";
import sellerLogo from "../assets/imgs/seller_Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const payload = { email, password, user_type: "seller" };
      const data = await loginSeller(payload);

      if (data.status === true || data.success === true) {
        const token =
          data.token || data.access_token || (data.user && data.user.token);
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user_type", "seller");
          localStorage.setItem(
            "user_info",
            JSON.stringify(data.user || data.data),
          );
          window.location.href = "/seller/dashboard";
        } else {
          setError("Login successful but token not received.");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Server connection failed.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] p-4 font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-purple-50 relative z-10"
      >
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-700 via-purple-600 to-blue-700 p-12 flex flex-col justify-center items-center text-white relative">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            src={sellerLogo}
            alt="Logo"
            className="w-64 h-auto drop-shadow-2xl mb-8"
          />
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Welcome Back, Partner!</h3>
            <p className="text-purple-100 opacity-80">
              Manage your business and sales with ease.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 bg-white rounded-3xl border-2 border-purple-100 shadow-[0_10px_40px_rgba(147,51,234,0.15)] m-2">
          <div className="mb-10 text-right">
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent italic">
              Kalkideals
            </h1>
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Seller Login
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
              Enter your credentials to access your dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-500 p-3 rounded-xl text-xs border border-red-100 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </motion.div>
              )}

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-700"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="text-right"></div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-purple text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 flex items-center justify-center gap-3 hover:bg-gray-900 transition-all overflow-hidden relative group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Login to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/seller/registration")}
                  className="text-purple-600 font-bold hover:underline decoration-2 underline-offset-4"
                >
                  Register Now
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
