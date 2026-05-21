"use client";
import React, { useState, useEffect } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { Menu, Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { getNotifications } from "../api/notification";

export default function SellerLayout() {
  // Sidebar open by default on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();

        if (res.success) {
          const filtered = res.data.filter(
            (n) => n.send_to === "seller" || n.send_to === "all",
          );

          setUnreadCount(filtered.length);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#f6f4ff] via-[#eef2ff] to-[#f9fbff] relative overflow-hidden">
      {/* Sidebar */}
      <SellerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Wrapper */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300
        ${sidebarOpen ? "lg:ml-72" : "ml-0"}`}
      >
        {/* Modern Navbar */}
        <header className="sticky top-0 z-30 px-4 md:px-6 pt-4">
          <div className="h-16 w-full rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between px-4 md:px-6">
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#ede9ff] to-[#dbeafe] hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                <Menu className="text-[#5b4bdb]" size={22} />
              </button>

              {/* Title */}
              <div>
                <h1 className="text-[18px] md:text-[20px] font-bold bg-gradient-to-r from-[#5b4bdb] to-[#7c3aed] bg-clip-text text-transparent">
                  Seller Panel
                </h1>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Notification */}
              <div
                onClick={() => navigate("/seller/notifications")}
                className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-[#f5f3ff] to-[#eff6ff] hover:scale-105 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Bell className="text-[#5b4bdb]" size={20} />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* Profile */}
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="rounded-3xl min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
