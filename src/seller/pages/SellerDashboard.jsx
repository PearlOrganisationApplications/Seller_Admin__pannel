"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { getSellerDashboard } from "../api/sellerDashboardApi"; // Adjust path as needed

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getSellerDashboard();
      // Assuming API returns { status: true, data: { stats: {...}, chart: [...], recent_returns: [...] } }
      // Adjust the 'res.data' based on your actual API response structure
      setDashboardData(res.data || res); 
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 font-bold">{error}</div>;
  }

  // Formatting helper for currency
  const formatINR = (value) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Action Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={() => navigate("/seller/product-listing")}
          className="bg-[#1E4CF6] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto"
        >
          + Add New Products
        </button>
      </div>

      {/* Stats Row 1: Dynamic Data Mapping */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { title: "Total Sales", value: formatINR(dashboardData?.total_sales) },
          { title: "Earnings", value: formatINR(dashboardData?.earnings) },
          { title: "Balance", value: formatINR(dashboardData?.balance) },
          { title: "Orders", value: dashboardData?.total_orders },
          { title: "Pending", value: dashboardData?.pending_orders },
        ].map((stat, i) => (
          <div key={i} className="border rounded-xl p-4 text-center bg-gray-50 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-500">{stat.title}</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-xl p-4 text-center shadow-sm bg-white">
          <p className="font-medium text-gray-600">Total Products Listed</p>
          <p className="text-2xl font-bold mt-1">{dashboardData?.total_products || 0}</p>
        </div>
        <div className="border rounded-xl p-4 text-center shadow-sm bg-white">
          <p className="font-medium text-gray-600">Cancelled/Returned</p>
          <p className="text-2xl font-bold mt-1 text-red-500">{dashboardData?.cancelled_returned || 0}</p>
        </div>
        <div className="bg-[#138A63] text-white p-5 rounded-xl text-center shadow-lg">
          <p className="font-medium opacity-90">Successfully Delivered</p>
          <p className="text-3xl font-bold">{dashboardData?.total_delivered || 0}</p>
        </div>
      </div>

      {/* Sales Chart: Uses live chart data from API */}
      <div className="border border-blue-100 rounded-2xl p-6 mb-10 bg-white w-full">
        <h3 className="font-bold text-gray-700 mb-6 px-2">Sales Analytics Overview</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData?.chart_data || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4A6CF7" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables: Dynamic Recent Returns */}
      <h3 className="font-bold text-lg mb-4 text-gray-800">Recent Return Orders</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-4 border-b">Order Id</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.recent_returns?.length > 0 ? (
              dashboardData.recent_returns.map((order, i) => (
                <tr key={order.id || i} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-blue-600">#{order.order_id}</td>
                  <td className="p-4">{order.customer_name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">No recent returns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}