"use client";
import React from "react";
import { X, User, Info, LogOut, LayoutDashboard, ShoppingBag, ClipboardList, Star, Headphones } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SellerSidebar({ isOpen, close }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navTo = (path) => {
    navigate(path);
    // Only close sidebar on mobile (screen < 1024px)
    if (window.innerWidth < 1024) close();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 
      transform transition-transform duration-300 ease-in-out border-r
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Mobile Close Button */}
      <button 
        className="lg:hidden absolute top-4 right-4 p-1 bg-gray-100 rounded-md"
        onClick={close}
      >
        <X size={20} />
      </button>

      {/* Profile Header */}
      <div className="h-40 bg-gradient-to-br from-[#0074A8] to-[#138A63] p-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
             <User className="text-white" size={32} />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-tight">Seller Account</p>
          <p className="text-white/70 text-xs">Verified Store</p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="px-4 mt-6 space-y-1">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={isActive("/seller/dashboard")}
          onClick={() => navTo("/seller/dashboard")}
        />
        <NavItem 
          icon={<ShoppingBag size={20} />} 
          label="Products & Inventory" 
          active={isActive("/seller/inventory")}
          onClick={() => navTo("/seller/inventory")}
        />
        <NavItem 
          icon={<ClipboardList size={20} />} 
          label="Order Management" 
          active={isActive("/seller/order-management")}
          onClick={() => navTo("/seller/order-management")}
        />
        <NavItem 
          icon={<Star size={20} />} 
          label="Reviews & Ratings" 
          onClick={() => navTo("/seller/reviews")} 
        />
      </div>

      {/* Footer Nav */}
      <div className="px-4 mt-auto absolute bottom-0 w-full pb-6 border-t pt-4 bg-white">
        <NavItem icon={<Headphones size={20} />} label="Help & Contact" onClick={() => {}} />
        <NavItem icon={<Info size={20} />} label="About Us" onClick={() => {}} />
        <button 
          className="w-full flex gap-3 items-center mt-4 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors" 
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

// Helper Component for cleaner code
function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
      ${active ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}