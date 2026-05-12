"use client";
import React from "react";
import {
  X, User, Info, LogOut, LayoutDashboard, ShoppingBag,
  ClipboardList, Star, Headphones, Settings2, Image as ImageIcon
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SellerSidebar({ isOpen, close }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navTo = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) close();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-60 
      transform transition-transform duration-300 ease-in-out border-r
      flex flex-col ${/* Uses flexbox to manage internal layout */ ""}
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Mobile Close Button */}
      <button
        className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10"
        onClick={close}
      >
        <X size={20} />
      </button>

      {/* 1. Profile Header (Fixed height) */}
      <div className="shrink-0 h-40 bg-gradient-to-r from-[#007394] to-[#009E73]
p-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
          <User className="text-white" size={32} />
        </div>
        <div className="overflow-hidden">
          <p className="text-white font-bold text-lg leading-tight truncate">Seller Account</p>
          <p className="text-white/70 text-xs">Verified Store</p>
        </div>
      </div>

      {/* 2. Scrollable Menu Area (flex-1 makes this fill the gap) */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={isActive("/seller/dashboard")}
          onClick={() => navTo("/seller/dashboard")}
        />
        <NavItem
          icon={<ShoppingBag size={20} />}
          label="Inventory"
          active={isActive("/seller/inventory")}
          onClick={() => navTo("/seller/inventory")}
        />
        <NavItem
          icon={<ClipboardList size={20} />}
          label="Orders"
          active={isActive("/seller/order-management")}
          onClick={() => navTo("/seller/order-management")}
        />
        <NavItem
          icon={<Settings2 size={20} />}
          label="Order Managment"
          active={isActive("/seller/managment")}
          onClick={() => navTo("/seller/managment")}
        />
        <NavItem
          icon={<Star size={20} />}
          label="Reviews & Ratings"
          active={isActive("/seller/reviews")}
          onClick={() => navTo("/seller/reviews")}
        />
        <NavItem
          icon={<Star size={20} />}
          label="Rate Admin Panel"
          active={isActive("/seller/platform-rating")}
          onClick={() => navTo("/seller/platform-rating")}
        />
      </div>

      {/* 3. Footer Area (Stays at bottom, but NOT absolute) */}
      <div className="shrink-0 px-4 pb-6 border-t pt-4 bg-white">
        <NavItem icon={<Headphones size={20} />} label="Help & Contact" onClick={() => { }} />
        <NavItem icon={<Info size={20} />} label="About Us" onClick={() => { }} />
        <button
          className="w-full flex gap-3 items-center mt-4 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}} />
    </div>
  );
}

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