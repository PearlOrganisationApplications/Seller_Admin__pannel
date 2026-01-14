"use client";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function CertifiedProducts() {
  const approvedCount = 4;
  const disapprovedCount = 4;

  const data = [
    { no: 1, id: "883484", product: "Women Kurti", approved: "Yes", reason: "All details are correct" },
    { no: 2, id: "883484", product: "Women Kurti", approved: "No", reason: "All details are not correct" },
    { no: 3, id: "883484", product: "Women Kurti", approved: "Yes", reason: "All details are correct" },
    { no: 4, id: "883484", product: "Women Kurti", approved: "No", reason: "All details are not correct" },
  ];
  const navigate = useNavigate()

  return (
    <div className="  bg-white p-4 sm:p-6 w-full">
      {/* Header */}
    <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-medium mb-4">
        Kalki Certified Products
      </h2>
       <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
    </div>
      <div className="h-px bg-gray-200 mb-6" />

      {/* Summary */}
      <div className="mb-6">
        <table className="w-full sm:w-64 border bg-blue-600 text-white rounded-md">
          <tbody>
            <tr>
              <td className="p-2 border">Total Approved</td>
              <td className="p-2 border">{approvedCount}</td>
            </tr>
            <tr>
              <td className="p-2 border">Total Unapproved</td>
              <td className="p-2 border">{disapprovedCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      {/* ================= MOBILE CARDS ================= */}
<div className="md:hidden space-y-4">
  {data.map((item) => (
    <div
      key={item.no}
      className="border rounded-lg p-4 shadow-sm bg-white"
    >
      {/* Product */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">Product</p>
        <p className="font-medium break-words">{item.product}</p>
      </div>

      {/* Product ID */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">Product ID</p>
        <p className="break-words">{item.id}</p>
      </div>

      {/* Approval */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">Approved</p>
        <p
          className={`font-semibold ${
            item.approved === "Yes"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {item.approved}
        </p>
      </div>

      {/* Reason */}
      <div>
        <p className="text-xs text-gray-500">Reason</p>
        <p className="text-sm text-gray-700 break-words">
          {item.reason}
        </p>
      </div>
    </div>
  ))}
</div>


      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">No</th>
              <th className="p-3 border">Product Id</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Approved</th>
              <th className="p-3 border">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.no} className="text-center">
                <td className="p-3 border">{item.no}</td>
                <td className="p-3 border">{item.id}</td>
                <td className="p-3 border">{item.product}</td>
                <td className="p-3 border">{item.approved}</td>
                <td className="p-3 border">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
