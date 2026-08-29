import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaTicketAlt,
  FaCertificate,
  FaAd,
  FaFolderPlus,
  FaBell,
  FaImage,
  FaStar,
  FaServer,
  FaHeadset,
  FaInfoCircle,
  FaGavel,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../seller/assets/Kalki_logo.png";

const Sidebar = React.memo(
  ({ collapsed = false, setCollapsed, mobileOpen, setMobileOpen }) => {
    const navigate = useNavigate();

    const menu = useMemo(
      () => [
        {
          to: "/admin/dashboard",
          icon: <FaTachometerAlt />,
          label: "Dashboard",
        },
        { to: "/admin/users", icon: <FaUsers />, label: "Customer Manage" },
        {
          to: "/admin/Seller",
          icon: <FaUserTie />,
          label: "Seller Management",
        },
        {
          to: "/admin/orders",
          icon: <FaShoppingCart />,
          label: "Order Management",
        },
        {
          to: "/admin/cupon-code",
          icon: <FaTicketAlt />,
          label: "Coupon Management",
        },
        {
          to: "/admin/kalki-certified",
          icon: <FaCertificate />,
          label: "Certified Management",
        },
        { to: "/admin/Advertisement", icon: <FaAd />, label: "Advertisement" },
        {
          to: "/admin/AddCategory",
          icon: <FaFolderPlus />,
          label: "Add Category",
        },
        {
  to: "/admin/SubCategory",
  icon: <FaFolderPlus />,
  label: "Sub Category",
},
        {
          to: "/admin/SendNotification",
          icon: <FaBell />,
          label: "Send Notification",
        },
        { to: "/admin/banners", icon: <FaImage />, label: "Banner Management" },
        { to: "/admin/ratings", icon: <FaStar />, label: "Rating Management" },
        {
          to: "/admin/smtp-settings",
          icon: <FaServer />,
          label: "SMTP Setting",
        },
        { to: "/admin/support", icon: <FaHeadset />, label: "Support" },
        { to: "/admin/about-us", icon: <FaInfoCircle />, label: "About Us" },
        {
          to: "/admin/terms-policies",
          icon: <FaGavel />,
          label: "Terms & Policies",
        },
      ],
      [],
    );

    const onNavClick = () => {
      if (window.innerWidth <= 768) setMobileOpen(false);
    };

    const handleLogout = () => {
      localStorage.clear();
      navigate("/");
    };

    return (
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
     <div className="sidebar-top" style={{ justifyContent: "center", position: "relative" }}>
{!collapsed && (
  <div>
    <h2
      className="sidebar-title"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <img src={logo} alt="Logo" className="sidebar-logo" />
      Admin Panel
    </h2>

    <div
      style={{
        width: "100%",
        height: "1px",
background: "#d1d5db",         marginTop: "10px",
      }}
    />
  </div>
)}
</div>

        <div className="sidebar-menu-container">
          <ul className="sidebar-menu">
            {menu.map((item, i) => (
              <li key={i} className="sidebar-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  onClick={onNavClick}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!collapsed && (
                    <span className="sidebar-label">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            {!collapsed && <span className="sidebar-label">Logout</span>}
          </button>
        </div>
      </aside>
    );
  },
);

export default Sidebar;