"use client";
import React, { useState, useEffect } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { Menu, Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { getNotifications } from "../api/notification";

export default function SellerLayout() {
  // Sidebar open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        if (res.success) {
          const filtered = res.data.filter(n => n.send_to === "seller" || n.send_to === "all");
          setUnreadCount(filtered.length);
        }
      } catch (err) { console.error(err); }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="flex bg-[#F1F2F4] min-h-screen w-full relative">
      
      {/* Sidebar Component */}
      <SellerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 min-w-0 
        ${/* THIS LINE PREVENTS OVERLAP ON DESKTOP */ ""}
        ${sidebarOpen ? "lg:ml-72" : "ml-0"}`}
      >
        {/* Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40 w-full">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="text-gray-600" size={24} />
            </button>
            <p className="font-bold text-gray-800">Seller Panel</p>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-full"
              onClick={() => navigate("/seller/notifications")}
            >
              <Bell className="text-gray-500" size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}