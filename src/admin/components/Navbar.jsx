import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImg from "../img/admin_profile.webp";
import { BASE_URL } from "../api/axios";
import { getProfile } from "../api/viewProfileApi"; // <--- Import your profile GET API
import { Bell } from "lucide-react";

export default function Navbar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadFreshData = async () => {
    try {
      // 1. Fetch the absolute latest data from the Server
      const res = await getProfile();
      const user = res.data.admin || res.data;

      setAdminName(user.name);
      setProfile(user.image);

      // 2. Sync localStorage so it stays updated for next time
      localStorage.setItem("adminName", user.name);
      localStorage.setItem("adminImage", user.image);
    } catch  {
      // Fallback to localStorage if API fails (offline mode)
      setAdminName(localStorage.getItem("adminName") || "Admin");
      setProfile(localStorage.getItem("adminImage"));
    }
  };

  useEffect(() => {
    // Load fresh data from API on mount
    loadFreshData();

    // Listen for changes from the ViewProfile page
    window.addEventListener("storage", loadFreshData);
    return () => window.removeEventListener("storage", loadFreshData);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const profileSrc = profile
    ? `${BASE_URL}/${profile}?t=${Date.now()}`
    : defaultImg;

  const onHamburger = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen && setMobileOpen(!mobileOpen);
    } else {
      setCollapsed && setCollapsed(!collapsed);
    }
  };

  return (
    <header
      className="app-navbar"
      style={{
        left: collapsed ? "60px" : "220px",
        width: collapsed ? "calc(100% - 60px)" : "calc(100% - 220px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px"
      }}
    >
      <div className="nav-left">
        <button className="hamburger" onClick={onHamburger} aria-label="Toggle menu">☰</button>
        <h2 className="admin-title">{adminName}</h2>
      </div>

      <div className="nav-right flex items-center gap-5" ref={dropdownRef}>

        {/* BELL ICON (Just navigation now) */}
        <div
          className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-all"
          onClick={() => navigate("/admin/notifications")}
          style={{ marginRight: '15px' }}
        >
          <Bell size={24} color="#555" />
        </div>

        <div className="profile-preview flex items-center gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
          <img
            src={profileSrc}
            className="w-10 h-10 rounded-full object-cover border border-gray-600"
            alt="Profile"
            onError={(e) => { e.target.src = defaultImg; }}
          />
        </div>

        {open && (
          <div className="profile-dropdown shadow-xl" style={{ position: 'absolute', top: '60px', right: '20px', background: 'white', zIndex: 1000 }}>
            <Link to="/admin/view-profile" className="dropdown-item">View Profile</Link>
          </div>
        )}
      </div>
    </header>
  );
}