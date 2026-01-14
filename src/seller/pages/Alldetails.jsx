"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AllDetails() {
  const products = [
    {
      no: 1,
      id: "#PID7",
      details: "Magic Lamp",
      price: "₹436",
      stock: 27,
      color: "Yellow",
      size: "2.39m",
      sold: 17,
      returned: 2,
      loss: 200,
      profitPerPiece: "₹350",
      netProfit: "₹1469",
      kalki: "Yes",
    },
    {
      no: 2,
      id: "#PID7",
      details: "Magic Lamp",
      price: "₹436",
      stock: 27,
      color: "Yellow",
      size: "2.39m",
      sold: 17,
      returned: 2,
      loss: 200,
      profitPerPiece: "₹350",
      netProfit: "₹1269",
      kalki: "No",
    },
    {
      no: 3,
      id: "#PID7",
      details: "Magic Lamp",
      price: "₹436",
      stock: 27,
      color: "Yellow",
      size: "2.39m",
      sold: 17,
      returned: 2,
      loss: 200,
      profitPerPiece: "₹350",
      netProfit: "₹1269",
      kalki: "Yes",
    },
  ];
const navigate = useNavigate()
  return (
    <div className="bg-white min-h-screen w-full p-4 sm:p-6 overflow-x-hidden">
      {/* ---------- TITLE ---------- */}
     
<div className="mb-6 w-full">
  <div className="flex items-center justify-between gap-4">
    <h1 className="text-xl sm:text-2xl font-medium">
      My Listed Products (All Details)
    </h1>

    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  </div>

  {/* divider must be OUTSIDE flex */}
  <div className="h-px bg-gray-200 mt-4" />
</div>


      {/* ================= TABLE (DESKTOP) ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-center">No.</th>
              <th className="p-2 border text-center">Product ID</th>
              <th className="p-2 border text-center">Product Details</th>
              <th className="p-2 border text-center">Final Price</th>
              <th className="p-2 border text-center">Stock</th>
              <th className="p-2 border text-center">Color</th>
              <th className="p-2 border text-center">Size</th>
              <th className="p-2 border text-center">Sold</th>
              <th className="p-2 border text-center">Returned</th>
              <th className="p-2 border text-center">Loss</th>
              <th className="p-2 border text-center">Profit/Piece</th>
              <th className="p-2 border text-center">Net Profit</th>
              <th className="p-2 border text-center">Kalki</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 border text-center">{p.no}</td>
                <td className="p-2 border text-center">{p.id}</td>
                <td className="p-2 border text-center">{p.details}</td>
                <td className="p-2 border text-center">{p.price}</td>
                <td className="p-2 border text-center">{p.stock}</td>
                <td className="p-2 border text-center">{p.color}</td>
                <td className="p-2 border text-center">{p.size}</td>
                <td className="p-2 border text-center">{p.sold}</td>
                <td className="p-2 border text-center text-red-600">{p.returned}</td>
                <td className="p-2 border text-center text-red-500">{p.loss}</td>
                <td className="p-2 border text-center">{p.profitPerPiece}</td>
                <td className="p-2 border text-center text-green-700">{p.netProfit}</td>
                <td className="p-2 border text-center">{p.kalki}</td>
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-3">
                    <Pencil size={18} className="text-blue-600 cursor-pointer" />
                    <Trash2 size={18} className="text-red-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CARDS (MOBILE / TABLET) ================= */}
      <div className="lg:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.no}
            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">#{p.no}</span>
              <span className="font-semibold">Kalki: {p.kalki}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><b>ID:</b> {p.id}</p>
              <p><b>Price:</b> {p.price}</p>
              <p><b>Product:</b> {p.details}</p>
              <p><b>Stock:</b> {p.stock}</p>
              <p><b>Color:</b> {p.color}</p>
              <p><b>Size:</b> {p.size}</p>
              <p><b>Sold:</b> {p.sold}</p>
              <p className="text-red-600"><b>Returned:</b> {p.returned}</p>
              <p className="text-red-500"><b>Loss:</b> ₹{p.loss}</p>
              <p><b>Profit:</b> {p.profitPerPiece}</p>
              <p className="text-green-700"><b>Net:</b> {p.netProfit}</p>
            </div>

            <div className="flex justify-end gap-4 mt-3">
              <Pencil size={18} className="text-blue-600 cursor-pointer" />
              <Trash2 size={18} className="text-red-600 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
