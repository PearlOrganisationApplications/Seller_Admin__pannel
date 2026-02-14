"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ShieldCheck, ClipboardCheck, Package, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. Updated Imports
import { fetchKalkiCertificates, requestKalkiCertificate } from "../api/requestCertificateApi"; 
import toast, { Toaster } from "react-hot-toast";

export default function KalkiCertifiedPage() {
  const navigate = useNavigate();
  
  // State Management
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reason, setReason] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchKalkiCertificates();
      if (res.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Form Submission
  const handleSubmit = async () => {
    // Validation
    if (!selectedProduct) return toast.error("Please select a product first");
    if (!reason.trim()) return toast.error("Please provide a reason for certification");
    if (reason.length < 10) return toast.error("Reason must be at least 10 characters");
    if (!isAgreed) return toast.error("Please confirm product accuracy");

    setSubmitting(true);
    
    const payload = {
      product_uid: selectedProduct.product_uid,
      reason: reason.trim()
    };

    // Use toast.promise for professional feedback
    const requestPromise = requestKalkiCertificate(payload);

    toast.promise(requestPromise, {
      loading: 'Submitting your application...',
      success: (res) => {
        // Reset form on success
        setSelectedProduct(null);
        setReason("");
        setIsAgreed(false);
        return "Application submitted successfully!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Failed to submit. Please try again.";
        return msg;
      }
    }, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });

    try {
      await requestPromise;
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-8 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Kalki Certification <ShieldCheck className="text-blue-600" size={24} />
              </h1>
              <p className="text-slate-500 text-sm">Request official quality badges for your top products</p>
            </div>
          </div>
        </div>
        <div className="h-px bg-slate-200 mt-6" />
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={loadData} className="ml-auto underline font-bold">Retry</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT: PRODUCT SELECTION ================= */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <Package size={16} /> Select a Product to Certify
              </h3>
            </div>

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-slate-400 text-sm font-medium">Fetching available products...</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/30 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">No.</th>
                        <th className="px-6 py-4">Product ID</th>
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.length > 0 ? products.map((item, index) => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedProduct(item)}
                          className={`cursor-pointer transition-all ${
                            selectedProduct?.id === item.id ? "bg-blue-50/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-slate-400 text-sm">{index + 1}</td>
                          <td className="px-6 py-4 font-bold text-slate-700 text-sm">#{item.product_uid}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium text-sm">{item.name}</td>
                          <td className="px-6 py-4 text-right">
                            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedProduct?.id === item.id 
                              ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                              : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                            }`}>
                              {selectedProduct?.id === item.id ? "Selected" : "Select"}
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-400">No products available for certification.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-slate-100">
                  {products.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedProduct(item)}
                      className={`p-4 transition-all ${selectedProduct?.id === item.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">ID: #{item.product_uid}</span>
                        {selectedProduct?.id === item.id && <CheckCircle2 size={16} className="text-blue-600" />}
                      </div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= RIGHT: REQUEST FORM ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ClipboardCheck size={20} className="text-blue-600" />
              Certification Request
            </h2>

            {selectedProduct ? (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Target Product</p>
                <p className="text-blue-900 font-bold">{selectedProduct.name}</p>
                <p className="text-blue-600 text-xs font-medium">Product ID: #{selectedProduct.product_uid}</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-400 text-sm">Please select a product from the list</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Reason for Certification
                </label>
                <textarea
                  className="w-full h-32 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Explain why this product deserves a Kalki Certified badge..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div 
                className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                onClick={() => setIsAgreed(!isAgreed)}
              >
                <input 
                    type="checkbox" 
                    checked={isAgreed}
                    readOnly
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                  I confirm that all product specifications provided are accurate.
                </span>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!selectedProduct || submitting || loading}
                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedProduct && !submitting
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-[0.98]" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                {submitting ? (
                    <> <Loader2 className="animate-spin" size={18} /> Processing... </>
                ) : (
                    <> <Send size={18} /> Submit Application </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}