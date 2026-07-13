"use client";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Wallet,
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSellerDashboard } from "../api/sellerDashboardApi";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getSellerDashboard();
      setDashboardData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const chartData = dashboardData?.monthly_orders
    ? Object.entries(dashboardData.monthly_orders).map(([m, v]) => ({
        month: m.substring(0, 3),
        orders: v,
      }))
    : [];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F6F8FC]">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1E4CF6] border-r-[#1E4CF6] animate-spin shadow-[0_0_20px_#1E4CF6]"></div>
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        {/* ================= ATTRATIVE HEADER ================= */}
        <div className="relative w-full bg-[#0B1E3A] px-4 pt-6 pb-8 rounded-b-[3rem] shadow-2xl overflow-hidden mb-6">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Seller Overview
              </h1>
              <p className="text-blue-200 mt-2 text-lg font-medium">
                Real-time business insights dashboard
              </p>
            </div>

            <button
              onClick={() => navigate("/seller/product-listing")}
              className="flex items-center gap-2 bg-white hover:bg-blue-50 text-[#0B1E3A] px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Monthly Earnings"
            value={formatINR(dashboardData?.earnings?.current_month)}
            icon={<Wallet className="text-blue-600" />}
          />
          <StatCard
            title="Withdraw Balance"
            value={formatINR(dashboardData?.earnings?.withdraw_balance)}
            icon={<ShoppingBag className="text-purple-600" />}
          />
          <StatCard
            title="Total Orders"
            value={dashboardData?.orders?.total}
            icon={<Package className="text-orange-500" />}
          />
          <StatCard
            title="Pending Orders"
            value={dashboardData?.orders?.pending}
            icon={<Clock className="text-amber-500" />}
          />
          <StatCard
            title="Completed Orders"
            value={dashboardData?.orders?.completed}
            icon={<CheckCircle className="text-green-600" />}
          />
          <StatCard
            title="Cancelled Orders"
            value={dashboardData?.orders?.cancelled}
            icon={<XCircle className="text-red-500" />}
          />
          <StatCard
            title="Returned Orders"
            value={dashboardData?.orders?.returned}
            icon={<RotateCcw className="text-purple-500" />}
          />
        </div>

        {/* CHART */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-5">Sales Performance</h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E4CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E4CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#1E4CF6"
                  fill="url(#g1)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SIDE + INVENTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* INVENTORY */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100">
            <h3 className="font-bold mb-4">Product Inventory</h3>

            <div className="space-y-3">
              <MiniRow
                label="Total Listed"
                value={dashboardData?.products?.total}
              />
              <MiniRow
                label="Active"
                value={dashboardData?.products?.active}
                green
              />
              <MiniRow
                label="Inactive"
                value={dashboardData?.products?.inactive}
                red
              />
            </div>
          </div>

          {/* SUCCESS CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#1E4CF6] to-[#4F7CFF] text-white rounded-2xl p-6 shadow-xl"
          >
            <CheckCircle className="absolute right-0 top-0 w-40 h-40 opacity-10" />

            <p className="text-sm opacity-80">Order Fulfillment</p>
            <h2 className="text-4xl font-bold mt-2">
              {dashboardData?.orders?.completed}
            </h2>
            <span className="inline-block mt-4 text-xs bg-white/20 px-3 py-1 rounded-full">
              Successfully Delivered
            </span>
          </motion.div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          <div className="flex justify-between p-5 border-b">
            <h3 className="font-bold">Recent Return Orders</h3>
            <button className="text-[#1E4CF6] flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData?.return_orders?.data?.length > 0 ? (
                dashboardData.return_orders.data.map((o, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="p-4 font-semibold text-[#1E4CF6]">
                      #{o.order_number}
                    </td>
                    <td className="p-4">{formatINR(o.amount)}</td>
                    <td className="p-4 text-center">
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    No return orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD (IMPROVED UI)
========================= */
function StatCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex justify-between items-center transition-all"
    >
      <div>
        <p className="text-xs text-gray-400 uppercase">{title}</p>
        <h2 className="text-xl font-bold text-gray-900 mt-1">{value}</h2>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 shadow-inner">{icon}</div>
    </motion.div>
  );
}

/* =========================
   MINI ROW COMPONENT
========================= */
function MiniRow({ label, value, green, red }) {
  return (
    <div
      className={`flex justify-between p-3 rounded-xl shadow-sm
      ${
        green
          ? "bg-green-50 text-green-700"
          : red
            ? "bg-red-50 text-red-700"
            : "bg-gray-50"
      }`}
    >
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
