import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, ResponsiveContainer, Cell
} from "recharts";
import Costumers from "../components/Costumers";
import { getDashboardSummary } from "../api/dashboardApi";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const PIE_COLORS = ["#004AAD", "#E5E7EB"]; // Blue for Active, Gray for Inactive

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardSummary();
        setData(result);
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Show loading state for individual values
  const getVal = (val) => (loading ? "..." : val || 0);

  return (
    <div className="p-2">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Costumers title={"Total Buyers"} qty={getVal(data?.total_buyers)} />
        <Costumers title={"Total Sellers"} qty={getVal(data?.total_sellers)} />
        <Costumers title={"Pending Orders"} qty={getVal(data?.pending_orders)} />
        <Costumers title={"Total Orders"} qty={getVal(data?.total_orders)} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Buyer Status Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-bold mb-4">Buyer Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active Buyers", value: data?.active_buyers || 0 },
                  { name: "Inactive", value: data?.inactive_buyers || 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                <Cell fill={PIE_COLORS[0]} />
                <Cell fill={PIE_COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs font-semibold text-gray-500 mt-2">Blue: Active | Gray: Inactive</div>
        </div>

        {/* Seller Status Chart (New) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-bold mb-4">Seller Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active Sellers", value: data?.active_sellers || 0 },
                  { name: "Inactive", value: data?.inactive_sellers || 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                <Cell fill={PIE_COLORS[0]} />
                <Cell fill={PIE_COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs font-semibold text-gray-500 mt-2">Blue: Active | Gray: Inactive</div>
        </div>

        {/* Order Statistics Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Orders by City</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.orders_by_city || []}>
              <XAxis dataKey="city" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Bar dataKey="orders_count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Pincode</th>
              <th className="p-4 font-semibold text-gray-700">Orders</th>
              <th className="p-4 font-semibold text-gray-700">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders_by_pincode?.map((item, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="p-4">{item.pincode}</td>
                <td className="p-4">{item.orders_count}</td>
                <td className="p-4 font-bold text-green-600">
                  ₹{parseFloat(item.total_amount).toLocaleString()}
                </td>
              </tr>
            ))}
            {(!data || data.orders_by_pincode?.length === 0) && !loading && (
                <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400">No data available</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;