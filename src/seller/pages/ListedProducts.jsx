"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, CheckCircle2, XCircle, Package, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchListedProducts } from "../api/listedProductApi";

export default function ListedProducts() {
  const navigate = useNavigate();

  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Automatically calculate stats whenever the products array changes
  const stats = useMemo(() => {
    if (!products.length) return { active: 0, inactive: 0 };

    return {
      active: products.filter(p => p.status?.toLowerCase() === "active").length,
      inactive: products.filter(p => p.status?.toLowerCase() !== "active").length
    };
  }, [products]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchListedProducts();

      if (res.success || res.status) {
        const rawData = res.data || [];

        // --- SORTING LOGIC: Newest products at the top ---
        const sortedData = [...rawData].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setProducts(sortedData);
      } else {
        setError("Failed to fetch products from server.");
      }
    } catch (err) {
      console.error("Load Error:", err);
      setError("Failed to load listed products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full px-4 sm:px-8 py-8 font-sans">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
            title="Go Back"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Listed Products
            </h2>
            <p className="text-xs text-gray-500">Manage your product catalog visibility</p>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="flex gap-3">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-green-100 shadow-sm min-w-30">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active</p>
              <p className="text-xl font-bold text-gray-800 leading-none">{stats.active}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-red-100 shadow-sm min-w-30">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inactive</p>
              <p className="text-xl font-bold text-gray-800 leading-none">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
          <button onClick={loadData} className="ml-auto text-sm underline font-bold">Retry</button>
        </div>
      )}

      {/* ---------- MAIN TABLE CONTAINER ---------- */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length > 0 ? (
                  products.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">#{item.product_uid || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.status?.toLowerCase() === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm italic">
                        {item.reason || "No remarks available"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Package size={40} className="opacity-20" />
                        <p>No products found in your catalog</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- MOBILE VIEW ---------- */}
          <div className="sm:hidden divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((item, index) => (
                <div key={item.id || index} className="p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      #{item.product_uid || 'N/A'}
                    </span>
                    {item.status?.toLowerCase() === "active" ? (
                      <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Active</span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Inactive</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">Reason:</span> {item.reason || "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">No products found</div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Showing {products.length} products listed in your catalog
        </p>
      </div>
    </div>
  );
}