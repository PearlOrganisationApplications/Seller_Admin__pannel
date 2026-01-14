"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KalkiCertifiedPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate()
  const products = [
    { id: 1, productID: "883484", productName: "Woman Kurti" },
    { id: 2, productID: "883484", productName: "Woman Kurti" },
    { id: 3, productID: "883484", productName: "Woman Kurti" },
    { id: 4, productID: "883484", productName: "Woman Kurti" },
    { id: 5, productID: "883484", productName: "Woman Kurti" },
    { id: 6, productID: "883484", productName: "Woman Kurti" },
    { id: 7, productID: "883484", productName: "Woman Kurti" },
    { id: 8, productID: "883484", productName: "Woman Kurti" },
  ];

  return (
    <div className="bg-white min-h-screen w-full p-4 sm:p-6 overflow-x-hidden">
      {/* ---------- TITLE ---------- */}
     <div className="mb-6 w-full">
  <div className="flex items-center justify-between gap-4">
    <h1 className="text-xl sm:text-2xl font-medium">
     Request for Kalki Certified
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


      <div className="flex flex-col items-center w-full gap-10">

        {/* ================= TABLE (DESKTOP) ================= */}
        <div className="hidden lg:block w-full max-w-3xl border rounded-md shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f5] border-b">
              <tr>
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Products</th>
                <th className="p-3 text-left">Request</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.productID}</td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="px-4 py-1 rounded-full bg-[#6bc5ff] hover:bg-[#3db4ff] text-white text-xs"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= CARDS (MOBILE / TABLET) ================= */}
        <div className="lg:hidden w-full max-w-3xl space-y-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>No. {item.id}</span>
                <span>ID: {item.productID}</span>
              </div>

              <p className="text-sm mb-3">
                <strong>Product:</strong> {item.productName}
              </p>

              <button
                onClick={() => setSelectedProduct(item)}
                className="px-4 py-1 rounded-full bg-[#6bc5ff] hover:bg-[#3db4ff] text-white text-xs"
              >
                Request
              </button>
            </div>
          ))}
        </div>

        {/* ================= REQUEST FORM ================= */}
        <div className="w-full max-w-md border rounded-md shadow-lg p-6 bg-white">
          <h2 className="text-sm font-semibold mb-2">
            Request for KalkiDeals Certification
          </h2>

          <p className="text-xs mb-2">
            <strong>Product ID:</strong>{" "}
            {selectedProduct ? selectedProduct.productID : "------"}
          </p>

          <label className="text-xs font-medium">
            Reason for Certification:
          </label>

          <textarea
            className="w-full mt-2 h-32 border rounded-md p-2 text-sm outline-none"
            placeholder="Write your reason..."
          />

          <div className="mt-3 flex items-start gap-2">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <span className="text-xs">
              I confirm the information is true and accurate
            </span>
          </div>

          <button className="mt-4 w-full bg-[#3f7bfd] hover:bg-[#2d66e8] text-white py-2 rounded-md text-sm">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
