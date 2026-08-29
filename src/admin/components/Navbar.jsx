import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImg from "../img/admin_profile.webp";
import { BASE_URL } from "../api/axios";
import { getProfile } from "../api/viewProfileApi";
import { Bell, Menu, ChevronDown, User } from "lucide-react";

export default function Navbar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadFreshData = async () => {
    try {
      const res = await getProfile();
      const user = res.data.admin || res.data;

      setAdminName(user.name);
      setProfile(user.image);

      localStorage.setItem("adminName", user.name);
      localStorage.setItem("adminImage", user.image);
    } catch {
      setAdminName(localStorage.getItem("adminName") || "Admin");
      setProfile(localStorage.getItem("adminImage"));
    }
  };

  useEffect(() => {
    loadFreshData();

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
      className="fixed top-0 z-40 flex items-center justify-between h-16 px-5 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm transition-all duration-300"
   style={{
  left: window.innerWidth <= 768 ? "0" : collapsed ? "60px" : "220px",
  width:
    window.innerWidth <= 768
      ? "100%"
      : collapsed
      ? "calc(100% - 60px)"
      : "calc(100% - 220px)",
}}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onHamburger}
          aria-label="Toggle menu"
          className="w-7 h-7 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-900 to black text-white shadow-md shadow-indigo-200 hover:scale-105 transition-transform duration-200"
        >
          <Menu size={20} />
        </button>
        
      </div>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0" ref={dropdownRef}>
        <span className="hidden sm:block text-sm font-semibold text-purple-700 truncate max-w-[80px]">
  {adminName}
</span>
        <div
          onClick={() => navigate("/admin/notifications")}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 border border-white/60 shadow-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all"
        >
          <Bell size={19} className="text-gray-600" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500"></span>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/70 border border-white/60 shadow-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all"
        >
          <img
            src={profileSrc}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
            alt="Profile"
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>

        {open && (
          <div className="absolute top-[60px] right-2 sm:right-5 w-52 max-w-[calc(100vw-16px)] bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {adminName}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <Link
              to="/admin/view-profile"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
            >
              <User size={16} />
              View Profile
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}