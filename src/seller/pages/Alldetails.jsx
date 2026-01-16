"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronLeft, ShieldCheck, Package, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import the API service
import { getSellerProducts } from "../api/allDetailsApi"; 

export default function AllDetails() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Using the Interceptor-powered service
      const result = await getSellerProducts();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.message || "Failed to load products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching data.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse image JSON string
  const getProductImage = (imgString) => {
    try {
      // Handle case where image might already be an array or a JSON string
      const images = typeof imgString === 'string' ? JSON.parse(imgString) : imgString;
      return images[0]; 
    } catch (e) {
      return "https://via.placeholder.com/150"; 
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4">
        <AlertTriangle className="text-red-500 mb-2" size={48} />
        <p className="text-slate-800 font-bold">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-8 font-sans">
      {/* ---------- HEADER ---------- */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                My Listed Products
              </h1>
              <p className="text-slate-500 text-sm">Real-time inventory and profit analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs font-bold text-slate-400 uppercase">Total Inventory</p>
              <p className="text-lg font-bold text-slate-700">{products.length} Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE (DESKTOP) ================= */}
      <div className="hidden lg:block max-w-[1600px] mx-auto overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">No.</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Final Price</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stock</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Specs</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">In-Hand Profit</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Certified</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 text-center text-slate-400 font-medium">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                        <img 
                          src={getProductImage(p.image)} 
                          alt={p.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-blue-600 font-semibold uppercase">{p.product_uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-slate-700">₹{p.final_price}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock < 10 ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      {p.variants?.length > 0 ? `${p.variants.length} Variants` : 'No Variants'}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                       <TrendingUp size={12} className="text-emerald-500" />
                       <span className="text-emerald-700 font-bold">₹{p.inhand_profit}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {p.kalki_certified === 1 ? (
                      <div className="flex justify-center text-blue-600" title="Kalki Certified">
                        <ShieldCheck size={22} />
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                        <Pencil size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CARDS (MOBILE / TABLET) ================= */}
      <div className="lg:hidden space-y-4 max-w-2xl mx-auto">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-slate-100">
                    <img src={getProductImage(p.image)} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{p.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">{p.product_uid}</p>
                </div>
              </div>
              {p.kalki_certified === 1 && <ShieldCheck size={20} className="text-blue-600" />}
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-y border-slate-50 py-4 my-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Stock / Status</p>
                <p className="text-sm font-bold text-slate-700">{p.stock} Units • {p.status}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Selling Price</p>
                <p className="text-sm font-bold text-slate-700">₹{p.final_price}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Estimated Profit</p>
                <p className="text-sm font-extrabold text-emerald-600">₹{p.inhand_profit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Listed Date</p>
                <p className="text-xs text-slate-600 font-medium">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                    <Pencil size={14} /> Edit
                 </button>
                 <button className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all">
                    <Trash2 size={16} />
                 </button>
              </div>
              {p.reason && (
                <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] max-w-[120px] text-right">
                  <AlertTriangle size={12} /> {p.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}