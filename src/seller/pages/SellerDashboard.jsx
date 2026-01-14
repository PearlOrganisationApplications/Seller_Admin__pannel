"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const demoData = [
  { month: "Jan", value: 400 }, { month: "Feb", value: 300 }, { month: "Mar", value: 500 },
  { month: "Apr", value: 200 }, { month: "May", value: 600 },
];

export default function SellerDashboard() {
  const navigate = useNavigate();

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

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {["Total Sales", "Earnings", "Balance", "Orders", "Pending"].map((title, i) => (
          <div key={i} className="border rounded-xl p-4 text-center bg-gray-50 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-500">{title}</p>
            <p className="text-lg font-bold text-gray-800 mt-1">₹43,258</p>
          </div>
        ))}
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-xl p-4 text-center shadow-sm bg-white">
          <p className="font-medium text-gray-600">Total Products Listed</p>
          <p className="text-2xl font-bold mt-1">156</p>
        </div>
        <div className="border rounded-xl p-4 text-center shadow-sm bg-white">
          <p className="font-medium text-gray-600">Cancelled/Returned</p>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
        <div className="bg-[#138A63] text-white p-5 rounded-xl text-center shadow-lg">
          <p className="font-medium opacity-90">Successfully Delivered</p>
          <p className="text-3xl font-bold">800</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="border border-blue-100 rounded-2xl p-6 mb-10 bg-white lg:w-[75%]">
        <h3 className="font-bold text-gray-700 mb-6 px-2">Sales Analytics Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4A6CF7" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
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
            {[1, 2, 3].map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-blue-600">#34167{i}</td>
                <td className="p-4">Customer Name</td>
                <td className="p-4"><span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Processing</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}