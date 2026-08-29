"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Package,
  AlertCircle,
  Loader2,
  RefreshCcw,
  Clock,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchReturnOrders } from "../api/orderManagementAPI";

export default function OrderManagement() {
  const navigate = useNavigate();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stats = useMemo(() => {
    if (!returns.length) return { refunded: 0, pending: 0 };

    return {
      refunded: returns.filter((r) => r.status?.toLowerCase() === "refunded")
        .length,
      pending: returns.filter((r) => r.status?.toLowerCase() !== "refunded")
        .length,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-purple-50 to-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-purple-400" size={40} />
          <p className="text-gray-600 font-bold tracking-wide">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-purple-50 to-white overflow-hidden pb-16 pt-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[95%] mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white p-8 md:p-6 shadow-lg shadow-purple-100 border border-purple-100 overflow-hidden mb-8"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="bg-purple-200/50 border border-purple-200 px-3 py-1 rounded-lg backdrop-blur-md inline-flex items-center gap-2">
                <RotateCcw size={16} className="text-purple-600" />
                <span className="text-purple-700 text-xs font-extrabold tracking-wider uppercase">
                  Return Hub
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-wide">
                Return Management
              </h1>
              <p className="text-purple-500 text-base font-medium">
                Track and manage customer return requests
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-3 bg-white backdrop-blur-md px-5 py-3 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-500 font-extrabold uppercase tracking-wider">
                      Refunded
                    </p>
                    <p className="text-xl font-black text-purple-900 leading-none">
                      {stats.refunded}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white backdrop-blur-md px-5 py-3 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-500 font-extrabold uppercase tracking-wider">
                      Pending
                    </p>
                    <p className="text-xl font-black text-purple-900 leading-none">
                      {stats.pending}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-100 backdrop-blur-md rounded-2xl transition-all duration-300 font-bold text-sm shadow-md hover:shadow-xl group self-start md:self-auto"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </motion.button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-md border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertCircle size={20} />
            <span className="font-semibold text-sm">{error}</span>
            <button
              onClick={loadData}
              className="ml-auto text-sm underline font-bold hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 text-white text-xs uppercase font-extrabold tracking-wider">
                  <th className="px-6 py-4 rounded-tl-3xl">No</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Return Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-3xl">Refund Date</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-purple-50"
              >
                {returns.length > 0 ? (
                  returns.map((item, index) => {
                    const product = item.order?.items[0]?.product;
                    return (
                      <motion.tr
                        key={item.id}
                        variants={itemVariants}
                        className="hover:bg-purple-50/60 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-400 font-bold text-sm">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-purple-700 text-sm">
                          #{item.order_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex-shrink-0 overflow-hidden border border-purple-100 shadow-sm">
                              <img
                                src={`https://kalkideals.com${item.product_image}`}
                                alt="return"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/no-image.png";
                                }}
                              />
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-900 font-extrabold line-clamp-1">
                                {product?.name || "Product Info N/A"}
                              </p>
                              <p className="text-purple-600 text-xs font-bold uppercase mt-0.5">
                                Price: ₹{item.order?.total_amount}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 text-xs font-semibold bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl inline-block">
                            {item.reason}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.status?.toLowerCase() === "refunded" ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                              <CheckCircle2 size={14} /> Refunded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                              <RefreshCcw size={14} className="animate-spin" />{" "}
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs font-bold">
                          {item.refunded_at
                            ? new Date(item.refunded_at).toLocaleDateString()
                            : "---"}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Package size={44} className="opacity-30 text-purple-400" />
                        <p className="font-bold text-gray-500">No return requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>

          <div className="sm:hidden divide-y divide-purple-50">
            {returns.map((item) => (
              <div key={item.id} className="p-4 bg-white/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                    #{item.order_id}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl border ${
                      item.status?.toLowerCase() === "refunded"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <img
                    src={`https://kalkideals.com${item.product_image}`}
                    className="w-14 h-14 rounded-2xl object-cover border border-purple-100 shadow-sm"
                    alt="return-mobile"
                  />
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm line-clamp-1">
                      {item.order?.items[0]?.product?.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5 font-medium">
                      Reason: {item.reason}
                    </p>
                    <p className="text-xs font-extrabold text-purple-700 mt-1">
                      Amt: ₹{item.order?.total_amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-gray-400 text-xs font-bold tracking-wide">
          Showing {returns.length} return requests
        </p>
      </div>
    </div>
  );
}