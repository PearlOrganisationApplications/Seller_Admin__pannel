import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Costumers from "../components/Costumers";
import { getDashboardSummary } from "../api/dashboardApi";
import { Users, Store, Clock3, ShoppingCart } from "lucide-react";

const PIE_COLORS = ["#2563EB", "#E5E7EB"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardSummary();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getVal = (val) => (loading ? "..." : (val ?? 0));

  const buyerPieData = useMemo(
    () => [
      { name: "Active Buyers", value: data?.active_buyers ?? 0 },
      { name: "Inactive", value: data?.inactive_buyers ?? 0 },
    ],
    [data],
  );

  const sellerPieData = useMemo(
    () => [
      { name: "Active Sellers", value: data?.active_sellers ?? 0 },
      { name: "Inactive", value: data?.inactive_sellers ?? 0 },
    ],
    [data],
  );

  const cityData = useMemo(() => data?.orders_by_city ?? [], [data]);

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Total Buyers</p>
              <h2 className="text-3xl font-bold mt-2">
                {getVal(data?.total_buyers)}
              </h2>
            </div>
            <Users size={42} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-sm">Total Sellers</p>
              <h2 className="text-3xl font-bold mt-2">
                {getVal(data?.total_sellers)}
              </h2>
            </div>
            <Store size={42} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm">Pending Orders</p>
              <h2 className="text-3xl font-bold mt-2">
                {getVal(data?.pending_orders)}
              </h2>
            </div>
            <Clock3 size={42} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm">Total Orders</p>
              <h2 className="text-3xl font-bold mt-2">
                {getVal(data?.total_orders)}
              </h2>
            </div>
            <ShoppingCart size={42} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Buyer Status
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={buyerPieData}
                dataKey="value"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
                label
              >
                {buyerPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Seller Status
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sellerPieData}
                dataKey="value"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
                label
              >
                {sellerPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Orders by City
          </h3>

          <ResponsiveContainer width="100%" height={250}>
          <BarChart
  data={cityData}
  margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
>
  <defs>
    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#A855F7" />
      <stop offset="50%" stopColor="#7C3AED" />
      <stop offset="100%" stopColor="#5B21B6" />
    </linearGradient>
  </defs>

  <CartesianGrid
    stroke="#E9D5FF"
    strokeDasharray="4 4"
    vertical={false}
  />

  <XAxis
    dataKey="city"
    axisLine={false}
    tickLine={false}
    tick={{ fill: "#6D28D9", fontSize: 13, fontWeight: 600 }}
  />

  <YAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: "#6D28D9", fontSize: 12 }}
  />

  <Tooltip
    cursor={{ fill: "rgba(168,85,247,0.12)" }}
    contentStyle={{
      background: "#fff",
      border: "2px solid #A855F7",
      borderRadius: "16px",
      boxShadow: "0 15px 35px rgba(124,58,237,.25)"
    }}
  />

  <Bar
    dataKey="orders_count"
    fill="url(#purpleGradient)"
    radius={[18, 18, 0, 0]}
    barSize={42}
    animationBegin={0}
    animationDuration={2200}
    animationEasing="ease-out"
  />
</BarChart>
          </ResponsiveContainer>
        </div>
      </div>

  <div className="relative rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl">
        <div className="px-6 py-5 border-b border-white/40 bg-gradient-to-r from-white/60 to-white/20 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
            Orders By Pincode
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/30 backdrop-blur-md text-gray-700">
                <th className="px-6 py-4 text-left font-semibold">Pincode</th>
                <th className="px-6 py-4 text-left font-semibold">Orders</th>
                <th className="px-6 py-4 text-left font-semibold">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {data?.orders_by_pincode?.length ? (
                data.orders_by_pincode.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/30 hover:bg-white/50 hover:backdrop-blur-lg hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-out"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.pincode}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-700 border border-blue-300/40 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {item.orders_count}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{Number(item.total_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : !loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    No data available
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
