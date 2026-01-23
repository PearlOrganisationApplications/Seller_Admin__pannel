"use client";
import React, { useState, useEffect } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { Menu, Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom"; // Added useNavigate
import { getNotifications } from "../api/notification"; // Import your API

export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch notification count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        if (res.success) {
          // Logic matches your SellerNotifications page filter
          const filtered = res.data.filter(
            (n) => n.send_to === "seller" || n.send_to === "all"
          );
          setUnreadCount(filtered.length);
        }
      } catch (err) {
        console.error("Error fetching notifications for layout:", err);
      }
    };

    fetchNotifications();
    
    // Optional: Refresh count every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-[#F1F2F4] min-h-screen w-full">
      {/* Sidebar */}
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
            {/* Notification Bell with Badge */}
            <div 
              className="relative cursor-pointer group"
              onClick={() => navigate("/seller/notifications")}
            >
              <Bell className="text-gray-500 group-hover:text-blue-600 transition-colors" size={22} />
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
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