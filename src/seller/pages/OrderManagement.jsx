"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function OrderManagement() {
  const orders = [
    {
      id: 1,
      name: "Aman Sharma",
      contact: "45634859",
      date: "28-06-25",
      address:
        "Building no 4, Morbi subdistrict, Jaxmi weight bridge , morbi District 363642",
      orderId: "ord224",
      product: "Woman T-shirt",
      size: "XL",
      color: "Black",
      price: "₹463",
      image: "https://via.placeholder.com/100x120.png?text=Product",
    },
    {
      id: 2,
      name: "Aman Sharma",
      contact: "45634859",
      date: "28-06-25",
      address:
        "Building no 4, Morbi subdistrict, Jaxmi weight bridge , morbi District 363642",
      orderId: "ord224",
      product: "Woman T-shirt",
      size: "XL",
      color: "Black",
      price: "₹463",
      image: "https://via.placeholder.com/100x120.png?text=Product",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white">

      {/* ---------- TOP BAR ---------- */}
      <div className="w-full flex flex-col sm:flex-row flex-wrap gap-3 px-3 sm:px-6 py-4 shadow-sm border-b">

        {/* LEFT SIDE */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition shrink-0"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <h1 className="text-base sm:text-lg md:text-xl font-semibold break-words">
            Order Management
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              placeholder="Search here"
              className="border rounded-md pl-9 pr-3 py-2 w-full outline-none text-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
          </div>

          {/* Notification */}
          <div className="relative cursor-pointer shrink-0">
            <span className="text-2xl">🔔</span>
            <span className="absolute -right-2 -top-1 bg-red-600 text-white text-xs px-1 rounded-full">
              88+
            </span>
          </div>
        </div>
      </div>

      {/* ---------- NOTIFICATION BAR ---------- */}
      <div className="bg-[#2e9bff] text-white text-center py-3 text-xs sm:text-lg font-semibold">
        88 New Notifications
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex flex-wrap gap-2 px-3 sm:px-6 mt-4">
        {[
          "All orders",
          "New Orders",
          "Confirmed Orders",
          "Cancelled Orders",
          "Pending Orders",
          "Kalki Certified Orders",
        ].map((tab, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded-md text-xs sm:text-sm ${
              index === 0 ? "bg-[#0972f6] text-white" : "bg-white text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="flex flex-wrap gap-2 px-3 sm:px-6 mt-4">
        {["Date", "Category", "Brand", "Price"].map((filter, index) => (
          <button
            key={index}
            className="px-3 py-1 border rounded-md flex items-center gap-2 text-xs sm:text-sm"
          >
            {filter} ▼
          </button>
        ))}
      </div>

      {/* ---------- ORDER LIST ---------- */}
      <div className="mt-6 px-3 sm:px-6">
        {orders.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 mb-6 shadow-sm bg-white"
          >
            {/* USER DETAILS */}
            <div className="flex flex-wrap gap-3 items-center text-xs sm:text-sm">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">{item.contact}</p>
              <p className="text-gray-600">{item.date}</p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
              {item.address}
            </p>

            {/* PRODUCT CARD */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">

              {/* IMAGE */}
              <img
                src={item.image}
                alt="product"
                className="w-24 sm:w-28 h-28 sm:h-32 object-cover rounded-md border"
              />

              {/* DETAILS */}
              <div className="flex flex-col text-xs sm:text-sm">
                <p>
                  <strong>Order Id - </strong>
                  {item.orderId}
                </p>
                <p>{item.product}</p>
                <p>Size - {item.size}</p>
                <p>Color - {item.color}</p>
              </div>

              {/* RIGHT SECTION */}
              <div className="sm:ml-auto flex flex-col gap-3 w-full sm:w-auto sm:items-end">
                <span className="bg-green-500 text-white px-4 py-1 rounded-md font-semibold w-fit text-sm">
                  {item.price}
                </span>

                <p className="text-xs text-gray-600">
                  Payment method - COD
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-300 text-sm">
                    Reject
                  </button>
                  <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#0047ab] text-white text-sm">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
