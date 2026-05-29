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

const PIE_COLORS = ["#004AAD", "#E5E7EB"];

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
    <div className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Costumers title="Total Buyers" qty={getVal(data?.total_buyers)} />
        <Costumers title="Total Sellers" qty={getVal(data?.total_sellers)} />
        <Costumers title="Pending Orders" qty={getVal(data?.pending_orders)} />
        <Costumers title="Total Orders" qty={getVal(data?.total_orders)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center">
          <h3 className="font-bold mb-4">Buyer Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={buyerPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
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

        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center">
          <h3 className="font-bold mb-4">Seller Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sellerPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
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

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="font-bold mb-4">Orders by City</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cityData}>
              <XAxis dataKey="city" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <CartesianGrid strokeDasharray="5 5" />
              <Bar
                dataKey="orders_count"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Pincode</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders_by_pincode?.length ? (
              data.orders_by_pincode.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-4">{item.pincode}</td>
                  <td className="p-4">{item.orders_count}</td>
                  <td className="p-4 font-bold text-green-600">
                    ₹{Number(item.total_amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No data available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
