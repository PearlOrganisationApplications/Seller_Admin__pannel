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
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSellerDashboard } from "../api/sellerDashboardApi";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getSellerDashboard();
      setDashboardData(res.data);
      setError(null);
    } catch {
      setError("Failed to load dashboard data.");
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
    ? Object.entries(dashboardData.monthly_orders).map(([month, val]) => ({
        month: month.substring(0, 3), // Shorten month name
        orders: val,
      }))
    : [];

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Overview</h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <button
          onClick={() => navigate("/seller/product-listing")}
          className="flex items-center justify-center gap-2 bg-[#1E4CF6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Monthly Earnings"
            value={formatINR(dashboardData?.earnings?.current_month)}
            icon={<Wallet className="text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Withdraw Balance"
            value={formatINR(dashboardData?.earnings?.withdraw_balance)}
            icon={<ShoppingBag className="text-purple-600" />}
            color="bg-purple-50"
          />
          <StatCard
            title="Total Orders"
            value={dashboardData?.orders?.total}
            icon={<Package className="text-orange-600" />}
            color="bg-orange-50"
          />
          <StatCard
            title="Pending"
            value={dashboardData?.orders?.pending}
            icon={<Clock className="text-amber-600" />}
            color="bg-amber-50"
          />
        </div>

        {/* Analytics & Product Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-800 text-lg">
                Sales Performance
              </h3>
              <select className="text-sm border-none bg-gray-50 rounded-lg p-1 text-gray-500 outline-none">
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1E4CF6"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#1E4CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#1E4CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Summary Side Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">
                Product Inventory
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 text-sm font-medium">
                    Total Listed
                  </span>
                  <span className="font-bold text-lg">
                    {dashboardData?.products?.total}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-green-700 text-sm font-medium">
                    Active
                  </span>
                  <span className="font-bold text-green-700 text-lg">
                    {dashboardData?.products?.active}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-red-700 text-sm font-medium">
                    Inactive
                  </span>
                  <span className="font-bold text-red-700 text-lg">
                    {dashboardData?.products?.inactive}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#138A63] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
              <CheckCircle className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
              <p className="text-sm opacity-80 font-medium">
                Order Fulfillment
              </p>
              <h4 className="text-3xl font-bold mt-1">
                {dashboardData?.orders?.completed}
              </h4>
              <p className="text-xs mt-4 bg-white/20 inline-block px-2 py-1 rounded">
                Successfully Delivered
              </p>
            </div>
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800">
              Recent Return Orders
            </h3>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboardData?.return_orders?.data?.length > 0 ? (
                  dashboardData.return_orders.data.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {formatINR(order.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          {order.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No returned orders found in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
}
