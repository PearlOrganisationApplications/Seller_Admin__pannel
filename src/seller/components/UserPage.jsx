"use client";
import React from "react";
import SellerLayout from "../layouts/SellerLayout";

// keep your chart imports and demoData same

export default function UserPage() {
  return (
    <SellerLayout>

      {/* All your UserPage content stays same */}
      <div className="w-[100%] border border-amber-100 bg-white rounded-md p-6 shadow-md">

      <div className="border border-amber-100 flex flex-col justify-between mt-6">

          {/* ----------- STAT CARDS ROW 1 ----------- */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {[
              "Total Sales",
              "Earning This Month",
              "Withdrawable Balance",
              "Total Orders",
              "Pending Orders",
            ].map((title, i) => (
              <div
                key={i}
                className="border rounded-md p-3 text-center shadow-sm text-sm"
              >
                <p className="font-medium">{title}</p>
                <p className="text-[#333] mt-2">₹43258</p>
              </div>
            ))}
          </div>

          {/* ----------- STAT CARDS ROW 2 ----------- */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border rounded-md p-3 text-center shadow-sm text-sm">
              <p className="font-medium">Total product Listed</p>
              <p className="text-[#333] mt-2">₹43258</p>
            </div>

            <div className="border rounded-md p-3 text-center shadow-sm text-sm">
              <p className="font-medium">Cancelled/Returned orders</p>
              <p className="text-[#333] mt-2">₹43258</p>
            </div>

            <div className="bg-[#138A63] text-white p-4 rounded-md text-center shadow text-sm">
              <p className="font-medium">Successfully Delivered orders</p>
              <p className="text-xl mt-1">800</p>
            </div>
          </div>

          {/* ----------- SALES CHART ----------- */}
          <div className="border-2 border-blue-500 rounded-md w-[70%] p-4 mb-10">
            <p className="font-semibold bg-white px-3 py-1 inline-block rounded shadow">
              All over Sales
            </p>

            <div className="mt-4 w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4A6CF7"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ----------- RETURN ORDERS TABLE ----------- */}
          <p className="font-medium text-lg mb-2">
            Return Order{" "}
            <span className="text-sm text-gray-600">(this week)</span>
          </p>

          <div className="overflow-x-auto w-4xl">
            <table className="w-full text-sm border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Order Id</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["#341674", "26-06-2030", "Aliya", "860", "Processing"],
                  ["#341672", "26-06-2030", "Adam", "860", "Shipped"],
                  ["#341676", "26-06-2030", "Manoj kumar", "860", "Pending"],
                  ["#341678", "26-06-2030", "Shritish", "860", "Delivered"],
                  ["#341674", "26-06-2030", "Ankul", "860", "Out of Delivery"],
                ].map((row, i) => (
                  <tr key={i} className="text-center">
                    {row.map((col, j) => (
                      <td key={j} className="p-2 border">
                        {col}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <br /><br />

          {/* ----------- DUPLICATE TABLE ----------- */}
          <div className="overflow-x-auto w-4xl">
            <table className="w-full text-sm border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Order Id</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["#341674", "26-06-2030", "Aliya", "860", "Processing"],
                  ["#341672", "26-06-2030", "Adam", "860", "Shipped"],
                  ["#341676", "26-06-2030", "Manoj kumar", "860", "Pending"],
                  ["#341678", "26-06-2030", "Shritish", "860", "Delivered"],
                  ["#341674", "26-06-2030", "Ankul", "860", "Out of Delivery"],
                ].map((row, i) => (
                  <tr key={i} className="text-center">
                    {row.map((col, j) => (
                      <td key={j} className="p-2 border">
                        {col}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </SellerLayout>
  );
}
