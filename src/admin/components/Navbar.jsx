import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImg from "../img/admin_profile.webp";

export default function Navbar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const load = () => {
      setAdminName(localStorage.getItem("adminName") || "Admin");
      setProfile(localStorage.getItem("adminImage"));
    };
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // close dropdown when clicking outside
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
    ? `${process.env.REACT_APP_BASE_URL || "https://kalkideals.com"}/uploads/admin/${profile}`
    : defaultImg;

  // Hamburger behavior: on small screens open mobile drawer, on large toggle collapsed
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
      }}
    >
      <div className="nav-left">
        <button className="hamburger" onClick={onHamburger} aria-label="Toggle menu">☰</button>

        {/* admin name — hide on tiny screens via CSS */}
        <h2 className="admin-title">{adminName}</h2>
      </div>

      <div className="nav-right" ref={dropdownRef}>
        <div className="notification" title="Notifications">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png"
            className="bell-icon"
            alt="notify"
          />
          <span className="notif-count">3</span>
        </div>

        <div className="profile-preview" onClick={() => setOpen(!open)} title="Profile">
          <img src={profileSrc} className="profile-img" alt="Profile" />
        </div>

        {open && (
          <div className="profile-dropdown">
            <Link to="/view-profile" className="dropdown-item">View Profile</Link>
            <div
              className="dropdown-item logout"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
