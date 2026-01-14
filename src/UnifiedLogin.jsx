import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Store } from "lucide-react";

export default function UnifiedLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Kalkideals</h2>
        <p className="text-slate-400 text-sm mb-10 font-medium">Select your portal to continue</p>

        <div className="grid gap-6">
          {/* ADMIN PORTAL BUTTON */}
          <button
            onClick={() => navigate("/admin/login")}
            className="group flex flex-col items-center justify-center p-8 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCog className="text-blue-600 w-8 h-8" />
            </div>
            <span className="font-black text-slate-700 tracking-wider">ADMIN PANEL</span>
          </button>

          {/* SELLER PORTAL BUTTON */}
          <button
            onClick={() => navigate("/seller/login")}
            className="group flex flex-col items-center justify-center p-8 border-2 border-slate-100 rounded-3xl hover:border-green-500 hover:bg-green-50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="text-green-600 w-8 h-8" />
            </div>
            <span className="font-black text-slate-700 tracking-wider">SELLER PANEL</span>
          </button>
        </div>

        <p className="mt-10 text-slate-400 text-xs font-medium">
          New seller? <button onClick={() => navigate("/seller/registration")} className="text-blue-600 font-bold underline">Register Now</button>
        </p>
      </div>
    </div>
  );
}