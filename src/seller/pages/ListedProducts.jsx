"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ListedProducts() {
  const navigate = useNavigate();

  const approvedCount = 5;
  const disapprovedCount = 14;

  return (
    <div className="bg-white min-h-screen w-full px-3 sm:px-6 py-6">

      {/* ---------- HEADER ---------- */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base sm:text-lg md:text-2xl font-medium break-words">
            My Listed Products (Approved / Unapproved)
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded 
            hover:bg-blue-600 transition w-fit"
          >
            <ChevronLeft className="mr-2 w-4 h-4" />
            Back
          </button>
        </div>
        <div className="h-px bg-gray-200 mt-4" />
      </div>
      
      {/* ---------- SUMMARY ---------- */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="overflow-x-auto">
          <table className="border bg-blue-600 text-white rounded-lg w-full sm:w-52 text-sm">
            <tbody>
              <tr>
                <td className="p-2 border">Approved</td>
                <td className="p-2 border">{approvedCount}</td>
              </tr>
              <tr>
                <td className="p-2 border">Disapproved</td>
                <td className="p-2 border">{disapprovedCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- RESPONSIVE TABLE ---------- */}
      <div className="w-full">
  <table className="w-full border border-gray-300 text-sm hidden sm:table">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 border">No</th>
        <th className="p-2 border">Product Id</th>
        <th className="p-2 border">Products</th>
        <th className="p-2 border">Approved</th>
        <th className="p-2 border">Reason</th>
      </tr>
    </thead>

    <tbody>
      {[
        ["1", "883484", "Women Kurti", "Yes", "All details are correct"],
        ["2", "883484", "Women Kurti", "No", "All details are not correct"],
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

  {/* ---------- MOBILE VIEW ---------- */}
  <div className="sm:hidden space-y-4">
    {[
      ["1", "883484", "Women Kurti", "Yes", "All details are correct"],
      ["2", "883484", "Women Kurti", "No", "All details are not correct"],
      ["3", "883484", "Women Kurti", "Yes", "All details are correct"],
      ["4", "883484", "Women Kurti", "No", "All details are not correct"],
    ].map((row, i) => (
      <div
        key={i}
        className="border rounded-lg p-3 bg-gray-50 space-y-1"
      >
        <p><span className="font-semibold">No:</span> {row[0]}</p>
        <p><span className="font-semibold">Product ID:</span> {row[1]}</p>
        <p><span className="font-semibold">Product:</span> {row[2]}</p>
        <p><span className="font-semibold">Approved:</span> {row[3]}</p>
        <p><span className="font-semibold">Reason:</span> {row[4]}</p>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
