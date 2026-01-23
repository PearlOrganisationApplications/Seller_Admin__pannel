"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ShieldCheck, XCircle, Package, Hash, CheckCircle2, AlertCircle, Loader2, Hourglass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCertificationSummary } from "../api/certificationApi"; 

export default function CertifiedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCertificationSummary();
      
      if (res && res.success && res.data) {
        setProducts(res.data.products || []);
        setStats({
          approved: res.data.total_approved || 0,
          rejected: res.data.total_rejected || 0,
        });
      } else {
        setError("Failed to fetch data: Invalid response format.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load certification summary.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * REVISED STATUS LOGIC:
   * Maps backend data to UI status. 
   * Checks numeric (kalki_certified) OR string (status).
   */
  const getStatusUI = (item) => {
    const statusStr = (item.status || "").toLowerCase();
    const numeric = item.kalki_certified;

    if (statusStr === "approved" || numeric === 1) {
      return {
        label: "Approved",
        classes: "bg-emerald-100 text-emerald-700",
        icon: <CheckCircle2 size={12} />,
        border: "bg-emerald-500"
      };
    } else if (statusStr === "rejected" || numeric === 2) {
      return {
        label: "Rejected",
        classes: "bg-rose-100 text-rose-700",
        icon: <XCircle size={12} />,
        border: "bg-rose-500"
      };
    } else {
      return {
        label: "Pending",
        classes: "bg-amber-100 text-amber-700",
        icon: <Hourglass size={12} />,
        border: "bg-amber-500"
      };
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium italic">Syncing certification records...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-8 font-sans">
      
      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Certified Products <ShieldCheck className="text-emerald-500" size={24} />
              </h1>
              <p className="text-slate-500 text-sm hidden sm:block">View your Kalki-Quality verified inventory</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={loadData} className="text-sm font-bold underline">Retry</button>
        </div>
      )}

      {/* ---------- SUMMARY STATS ---------- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-black text-slate-800">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-slate-800">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* ---------- CONTENT TABLE ---------- */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? products.map((item, index) => {
                const ui = getStatusUI(item);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-medium text-sm">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">
                        <Hash size={12} /> {item.product_uid}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-slate-300" />
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${ui.classes}`}>
                        {ui.icon} {ui.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm italic">
                      {item.reason || "Waiting for review..."}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">No certification records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-slate-100">
          {products.map((item) => {
            const ui = getStatusUI(item);
            return (
              <div key={item.id} className="p-5 bg-white relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ui.border}`} />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded">
                    <Hash size={12} /> {item.product_uid}
                  </div>
                  <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${ui.classes.replace('bg-', 'text-').split(' ')[1]}`}>
                    {ui.icon} {ui.label}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h4>
                <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-2 mt-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Remarks:</span>
                  {item.reason || "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}