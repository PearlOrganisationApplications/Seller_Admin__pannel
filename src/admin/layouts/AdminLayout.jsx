import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 1. Import useLocation
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../components/Sidebar.css";
import "../components/Navbar.css";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const location = useLocation(); // 2. Get current path

  // 3. Define the condition (Check if current path is dashboard)
  // This matches "/dashboard" or "/admin/dashboard" depending on your setup
  const isDashboard = location.pathname.endsWith("/dashboard");

  // Close mobile drawer on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  // 4. If NOT dashboard, return only children (Full Screen)
  if (!isDashboard) {
    return <div className="full-page-content">{children}</div>;
  }

  // 5. If IS dashboard, show Sidebar and Navbar
  const contentClass = `admin-content ${collapsed ? "collapsed" : ""} ${mobileOpen ? "no-scroll" : ""}`;

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className={contentClass}>
        {children}
      </main>

      {mobileOpen && <div className="drawer-overlay" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}