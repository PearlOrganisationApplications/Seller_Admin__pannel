"use client";
import React, { useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { Menu, Bell } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function SellerLayout() {
  // Set default to true for desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#F1F2F4] min-h-screen w-full">
      {/* Sidebar - Width set to w-72 (288px) */}
      <SellerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 min-w-0 
        ${sidebarOpen ? "lg:ml-72" : "ml-0"}`}
      >
        {/* Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40 w-full">
          <div className="flex items-center gap-4">
            <Menu 
              className="cursor-pointer text-gray-600 hover:text-black" 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
            />
            <p className="font-bold text-gray-800">Seller Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-gray-500 cursor-pointer hover:text-blue-600" size={20} />
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              S
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}