"use client";
import React, { useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { Menu, Bell } from "lucide-react";
import { Outlet } from "react-router-dom"; // IMPORTANT

export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#F1F2F4] min-h-screen w-full relative">
      {/* Sidebar is here */}
      <SellerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? "lg:pl-72" : "pl-0"}`}>
        {/* Navbar is here */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Menu className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
            <p className="font-bold">Seller Dashboard</p>
          </div>
          <Bell className="text-gray-500 cursor-pointer" />
        </header>

        {/* This Renders the Dashboard inside the layout */}
        <main className="p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}