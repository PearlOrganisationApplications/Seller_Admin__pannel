import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Store, ShieldCheck } from "lucide-react";

export default function UnifiedLogin() {
  const navigate = useNavigate();

  const bubbles = [
    { size: 70, left: "8%", delay: "0s", duration: "20s" },
    { size: 40, left: "18%", delay: "4s", duration: "16s" },
    { size: 100, left: "30%", delay: "2s", duration: "24s" },
    { size: 35, left: "45%", delay: "6s", duration: "14s" },
    { size: 55, left: "58%", delay: "1s", duration: "22s" },
    { size: 85, left: "70%", delay: "5s", duration: "18s" },
    { size: 40, left: "82%", delay: "3s", duration: "15s" },
    { size: 65, left: "92%", delay: "7s", duration: "21s" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0f1226]">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.25; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1226] via-[#241b52] to-[#0e3a5f]"></div>
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-purple-600 rounded-full blur-[130px] opacity-15"></div>
      <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-sky-500 rounded-full blur-[130px] opacity-15"></div>

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
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(147,197,253,0.04))",
            border: "1px solid rgba(255,255,255,0.08)",
            animation: `floatUp ${b.duration} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}

      <div className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(15,18,38,0.5)] p-10 border border-white/60 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 flex items-center justify-center shadow-md">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mt-3 tracking-tight">
          Kalkideals
        </h2>
        <p className="text-slate-500 text-sm mb-9 font-medium">
          Select your portal to continue
        </p>

        <div className="grid gap-5">
          <button
            onClick={() => navigate("/admin/login")}
            className="group flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:bg-white hover:border-violet-300 hover:shadow-[0_10px_30px_rgba(124,58,237,0.18)] hover:-translate-y-0.5 transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <UserCog className="text-white w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 tracking-wide text-base">
                Admin Panel
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Manage the platform
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/seller/login")}
            className="group flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:bg-white hover:border-sky-300 hover:shadow-[0_10px_30px_rgba(14,165,233,0.18)] hover:-translate-y-0.5 transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Store className="text-white w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 tracking-wide text-base">
                Seller Panel
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Grow your store
              </p>
            </div>
          </button>
        </div>

        <div className="mt-9 pt-5 border-t border-slate-100">
          <p className="text-slate-400 text-xs font-medium tracking-widest">
            KALKIDEALS © 2026
          </p>
        </div>
      </div>
    </div>
  );
}