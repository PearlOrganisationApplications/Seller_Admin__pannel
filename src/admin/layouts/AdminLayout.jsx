import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../components/Sidebar.css";
import "../components/Navbar.css";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Yaha un pages ke paths daalo jaha Sidebar/Navbar NAHI dikhana
  const noLayoutRoutes = ["/admin/login", "/admin/forgot-password"];
  const hideLayout = noLayoutRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  // Sirf in specific pages pe full-screen (bina sidebar)
  if (hideLayout) {
    return <div className="full-page-content">{children}</div>;
  }

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
      <main className={contentClass}>{children}</main>
      {mobileOpen && (
        <div className="drawer-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}