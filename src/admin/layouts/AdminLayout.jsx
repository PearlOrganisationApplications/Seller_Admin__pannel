import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../components/Sidebar.css";
import "../components/Navbar.css";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse (220 -> 60)
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer open

  // Close mobile drawer on route change or resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  // Compute content class
  const contentClass = `admin-content ${collapsed ? "collapsed" : ""} ${mobileOpen ? "no-scroll" : ""}`;

  return (
    <div className="admin-layout">
      {/* Sidebar gets both desktop collapsed state and mobile open control */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Navbar controls collapse/mobileOpen */}
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content area (margin left is controlled in CSS) */}
      <main className={contentClass}>
        {children}
      </main>

      {/* Optional overlay when mobile drawer is open */}
      {mobileOpen && <div className="drawer-overlay" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

