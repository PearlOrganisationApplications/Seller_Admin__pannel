import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaSignOutAlt,
  FaServer,      // Icon for SMTP
  FaHeadset,     // Icon for Support
  FaInfoCircle   // Icon for About Us
} from "react-icons/fa";

export default function Sidebar({ collapsed = false, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  // Closes the sidebar when a link is clicked (on mobile view only)
  const onNavClick = () => {
    if (window.innerWidth <= 768 && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  // Clears local storage and redirects to the portal selection page
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const cls = `sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`;

  return (
    <aside className={cls}>
      {/* Top Section: Title and Toggle Button */}
      <div className="sidebar-top">
        {!collapsed && <h2 className="sidebar-title font-bold">Admin Panel</h2>}
        <button 
          className="collapse-toggle" 
          onClick={() => window.innerWidth <= 768 ? setMobileOpen(!mobileOpen) : setCollapsed(!collapsed)}
        > 
          ☰ 
        </button>
      </div>

      <ul>
        {/* DASHBOARD */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaTachometerAlt />
          {!collapsed && <Link to="/admin/dashboard">Dashboard</Link>}
        </li>

        {/* CUSTOMER MANAGEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaUsers />
          {!collapsed && <Link to="/admin/users">Customer Management</Link>}
        </li>

        {/* SELLER MANAGEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaUserTie />
          {!collapsed && <Link to="/admin/Seller">Seller Management</Link>}
        </li>

        {/* ORDER MANAGEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaShoppingCart />
          {!collapsed && <Link to="/admin/orders">Order Management</Link>}
        </li>

        {/* COUPON MANAGEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaTicketAlt />
          {!collapsed && <Link to="/admin/cupon-code">Coupon Management</Link>}
        </li>

        {/* CERTIFIED MANAGEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaCertificate />
          {!collapsed && <Link to="/admin/kalki-certified">Certified Management</Link>}
        </li>

        {/* ADVERTISEMENT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaAd />
          {!collapsed && <Link to="/admin/Advertisement">Advertisement</Link>}
        </li>

        {/* ADD CATEGORY */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaFolderPlus />
          {!collapsed && <Link to="/admin/AddCategory">Add Category</Link>}
        </li>

        {/* SEND NOTIFICATION */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaBell />
          {!collapsed && <Link to="/admin/SendNotification">Send Notification</Link>}
        </li>

        {/* SMTP SETTING */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaServer />
          {!collapsed && <Link to="/admin/smtp-settings">SMTP Setting</Link>}
        </li>

        {/* SUPPORT */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaHeadset />
          {!collapsed && <Link to="/admin/support">Support</Link>}
        </li>

        {/* ABOUT US */}
        <li className="sidebar-item" onClick={onNavClick}>
          <FaInfoCircle />
          {!collapsed && <Link to="/admin/about-us">About Us</Link>}
        </li>
     

        {/* LOGOUT BUTTON */}
        <li 
          className="sidebar-item logout-item" 
          onClick={handleLogout} 
          style={{ marginTop: '20px', color: '#ff4d4d', cursor: 'pointer' }}
        >
          <FaSignOutAlt />
          {!collapsed && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Logout</span>}
        </li>
      </ul>
    </aside>
  );
}