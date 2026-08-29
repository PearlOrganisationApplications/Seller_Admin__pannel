import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, PackageCheck } from "lucide-react";

export default function OrderManage() {
  const [status, setStatus] = useState("Order placed");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
        >
          <ArrowLeft size={16} /> 
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <PackageCheck className="text-white" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Order Tracking
          </h2>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white/60 shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">No.</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Order ID</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Date</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Time</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Reason</th>
                <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-white/40 hover:bg-white/60 hover:shadow-md transition-all duration-200">
                <td className="px-5 py-4 text-gray-600">1</td>
                <td className="px-5 py-4 font-semibold text-gray-800">#KJK9632</td>

                <td className="px-5 py-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  >
                    <option>Order placed</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Out for delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>

                <td className="px-5 py-4 text-gray-600">12/aug/2025</td>
                <td className="px-5 py-4 text-gray-600">10:11 pm</td>

                <td className="px-5 py-4">
                  <textarea
                    placeholder="Write reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full min-w-[160px] px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all resize-none"
                    rows={2}
                  />
                </td>

                <td className="px-5 py-4 text-center">
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-200 hover:opacity-90 transition-all">
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm px-5 py-4">
          <p className="text-sm font-medium text-gray-700">
            Order placed 10:11pm 12 Aug 2025
          </p>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-300/40 hover:bg-indigo-500/20 transition-all text-xs font-medium">
            <Bell size={13} /> Send Notification
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm px-5 py-4">
          <p className="text-sm font-medium text-gray-700">
            Order Cancelled 10:11pm 12 Aug 2025
            <span className="ml-2 text-red-500 text-xs font-semibold">
              (Out of Stock)
            </span>
          </p>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-300/40 hover:bg-indigo-500/20 transition-all text-xs font-medium">
            <Bell size={13} /> Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}