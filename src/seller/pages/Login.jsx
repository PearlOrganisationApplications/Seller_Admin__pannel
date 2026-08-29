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

  const bubbles = [
    { size: 70, left: "8%", delay: "0s", duration: "8s" },
    { size: 40, left: "20%", delay: "4s", duration: "16s" },
    { size: 95, left: "35%", delay: "2s", duration: "10s" },
    { size: 35, left: "50%", delay: "6s", duration: "14s" },
    { size: 55, left: "65%", delay: "1s", duration: "12s" },
    { size: 80, left: "78%", delay: "5s", duration: "8s" },
    { size: 45, left: "90%", delay: "3s", duration: "15s" },
  ];

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
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden relative"
      style={{
        backgroundColor: "#0f1226",
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(124,58,237,0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(14,165,233,0.25) 0px, transparent 50%), linear-gradient(135deg, #0f1226 0%, #241b52 55%, #0e3a5f 100%)",
      }}
    >
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.25; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }
      `}</style>

      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-purple-600 rounded-full blur-[130px] opacity-15 pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-sky-500 rounded-full blur-[130px] opacity-15 pointer-events-none"></div>

      {bubbles.map((b, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            bottom: "-10%",
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(147,197,253,0.04))",
            border: "1px solid rgba(255,255,255,0.08)",
            animation: `floatUp ${b.duration} ease-in-out infinite`,
            animationDelay: b.delay,
            pointerEvents: "none",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,18,38,0.5)] w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/60 relative z-10"
      >
        <div className="w-full md:w-1/2 bg-gradient-to-br from-violet-700 via-purple-600 to-sky-600 p-12 flex flex-col justify-center items-center text-white relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-52 h-52 rounded-2xl bg-white/95 flex items-center justify-center shadow-2xl mb-8 p-4"
          >
            <img
              src={sellerLogo}
              alt="Kalki Deals"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Welcome Back, Partner!</h3>
            <p className="text-violet-100 opacity-80">
              Manage your business and sales with ease.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-sky-400"></div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 bg-white">
          <div className="mb-10 text-right">
            <h1 className="text-4xl font-black bg-gradient-to-r from-violet-700 to-sky-600 bg-clip-text text-transparent tracking-tight">
              Kalkideals
            </h1>
          </div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Seller Login
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              Enter your credentials to access your dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </motion.div>
              )}

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-700"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all overflow-hidden relative group"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                  boxShadow: "0 10px 24px rgba(124,58,237,0.3)",
                }}
              >
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
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/seller/registration")}
                  className="text-violet-600 font-bold hover:underline decoration-2 underline-offset-4"
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