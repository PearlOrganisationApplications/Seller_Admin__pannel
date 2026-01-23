import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  ResponsiveContainer
} from "recharts";
import Costumers from "../components/Costumers";
// Import the new API service
import { getDashboardBuyers, getDashboardSellers } from "../api/dashboardApi";

const barData = [
  { name: "Jan", orders: 400 },
  { name: "Feb", orders: 300 },
  { name: "Mar", orders: 500 },
  { name: "Apr", orders: 200 },
  { name: "May", orders: 700 },
];

const Dashboard = () => {
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalSellers, setTotalSellers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Run both requests in parallel
        const [buyersData, sellersData] = await Promise.all([
          getDashboardBuyers(),
          getDashboardSellers()
        ]);

        if (buyersData.status) {
          setTotalBuyers(buyersData.customers?.length || 0);
        }
        if (sellersData.status) {
          setTotalSellers(sellersData.sellers?.length || 0);
        }
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-2">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Costumers title={"Total Buyers"} qty={loading ? "..." : totalBuyers} />
        <Costumers title={"Total Sellers"} qty={loading ? "..." : totalSellers} />
        <Costumers title={"Pending Orders"} qty={1192} />
        <Costumers title={"Total Orders"} qty={5692} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-bold mb-4">Buyer Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active Buyers", value: totalBuyers },
                  { name: "Inactive", value: 20 },
                ]}
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#004AAD" 
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Order Statistics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Bar dataKey="orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">City</th>
              <th className="p-4 font-semibold text-gray-700">Orders</th>
              <th className="p-4 font-semibold text-gray-700">Pincode</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4">Gujarat</td>
              <td className="p-4">562</td>
              <td className="p-4">326518</td>
              <td className="p-4">₹4,45,559</td>
            </tr>
            <tr>
              <td className="p-4">Maharashtra</td>
              <td className="p-4">600</td>
              <td className="p-4">326519</td>
              <td className="p-4">₹2,45,203</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;