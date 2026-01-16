import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/Base_url";
import sellerLogo from "../assets/imgs/seller_Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, user_type: "seller" }),
      });

      const data = await res.json();

      if (data.status === true) {
        const token = data.user?.token || data.token;
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_type", "seller"); 
        localStorage.setItem("user_info", JSON.stringify(data.user));
        window.location.href = "/seller/dashboard"; 
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 flex flex-col">
        
        {/* Top Section: Split between Logo and Form */}
        <div className="flex flex-col md:flex-row items-center w-full">
          {/* Left Side: Logo */}
          <div className="w-full md:w-1/2 flex justify-center p-4">
            <img src={sellerLogo} alt="Seller Logo" className="w-[320px] h-auto" />
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-6">
            <h1 className="text-4xl font-light mb-6 border-b pb-2 text-right pr-4 text-gray-700">Kalkideals</h1>
            <h2 className="font-semibold text-lg mb-3">Seller Account Login</h2>
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
              <button 
                onClick={handleLogin} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Registration Link */}
        <div className="mt-3 pt-4 border-t border-gray-100 text-center">
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