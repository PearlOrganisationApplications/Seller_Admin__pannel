"use client";
import React, { useState } from "react";
import { Menu, Bell } from "lucide-react";
import SellerSidebar from "./SellerSidebar";

// ... your imports for chart remain same

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <SellerSidebar
        isOpen={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />

      {/* Main Page */}
      <div className="w-[100%] border border-amber-100 bg-white rounded-md p-6 shadow-md relative">

        {/* TITLE */}
        <h1 className="text-xl font-semibold">Seller Dashboard</h1>

        {/* HEADER */}
        <div className="mt-6 relative w-full flex items-center">

          {/* LEFT - Menu opens sidebar */}
          <Menu
            className="absolute left-0 h-6 w-6 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />

          {/* CENTER */}
          <button className="mx-auto bg-[#1E4CF6] text-white px-6 py-2 rounded text-sm">
            + Add New Products
          </button>

          {/* RIGHT */}
          <Bell className="absolute right-0 h-6 w-6 cursor-pointer" />
        </div>

        {/* ---- (your remaining dashboard code stays SAME) ---- */}

      </div>
    </>
  );
}
