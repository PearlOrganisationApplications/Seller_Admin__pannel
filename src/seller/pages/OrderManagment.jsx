"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, CheckCircle2, XCircle, Package, AlertCircle, Loader2, RefreshCcw, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchReturnOrders } from "../api/orderManagementAPI";

export default function OrderManagement() {
    const navigate = useNavigate();

    // State Management
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Automatically calculate stats (Refunded vs Pending/Other)
    const stats = useMemo(() => {
        if (!returns.length) return { refunded: 0, pending: 0 };

        return {
            refunded: returns.filter(r => r.status?.toLowerCase() === "refunded").length,
            pending: returns.filter(r => r.status?.toLowerCase() !== "refunded").length
        };
    }, [returns]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchReturnOrders();

            if (res.success) {
                // Sort by newest return request first
                const sortedData = [...res.returns].sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                setReturns(sortedData);
            } else {
                setError("Failed to fetch returns from server.");
            }
        } catch (err) {
            console.error("Load Error:", err);
            setError("Failed to load return requests. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-gray-500 font-medium">Loading returns...</p>
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
                            Return Management
                        </h2>
                        <p className="text-xs text-gray-500">Track and manage customer return requests</p>
                    </div>
                </div>

                {/* Status Summary Cards */}
                <div className="flex gap-3">
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-green-100 shadow-sm min-w-30">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Refunded</p>
                            <p className="text-xl font-bold text-gray-800 leading-none">{stats.refunded}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-amber-100 shadow-sm min-w-30">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <Clock size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pending</p>
                            <p className="text-xl font-bold text-gray-800 leading-none">{stats.pending}</p>
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
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">Return Reason</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Refund Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {returns.length > 0 ? (
                                    returns.map((item, index) => {
                                        const product = item.order?.items[0]?.product;
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 font-bold text-blue-600">#{item.order_id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden border">
                                                            <img
                                                                src={`https://kalkideals.com${item.product_image}`}
                                                                alt="return"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
                                                            />
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="text-gray-800 font-bold line-clamp-1">{product?.name || "Product Info N/A"}</p>
                                                            <p className="text-gray-400 text-xs uppercase font-medium">Price: ₹{item.order?.total_amount}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                                                        {item.reason}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status?.toLowerCase() === "refunded" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase">
                                                            <CheckCircle2 size={12} /> Refunded
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 uppercase">
                                                            <RefreshCcw size={12} className="animate-spin-slow" /> {item.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-500 text-sm">
                                                    {item.refunded_at ? new Date(item.refunded_at).toLocaleDateString() : '---'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <Package size={40} className="opacity-20" />
                                                <p>No return requests found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ---------- MOBILE VIEW ---------- */}
                    <div className="sm:hidden divide-y divide-gray-100">
                        {returns.map((item) => (
                            <div key={item.id} className="p-4 bg-white space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        #{item.order_id}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.status === 'refunded' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <img
                                        src={`https://kalkideals.com${item.product_image}`}
                                        className="w-14 h-14 rounded object-cover border"
                                        alt="return-mobile"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.order?.items[0]?.product?.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 italic">Reason: {item.reason}</p>
                                        <p className="text-xs font-bold text-gray-700 mt-1">Amt: ₹{item.order?.total_amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer info */}
                <p className="mt-6 text-center text-gray-400 text-sm">
                    Showing {returns.length} return requests
                </p>
            </div>
        </div>
    );
}