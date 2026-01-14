"use client";
import React from "react";
import { X, User, Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerSidebar({ isOpen, close }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear token, user_type, etc.
    window.location.href = "/login"; // Force full refresh to clear all states
  };

  const navTo = (path) => {
    navigate(path);
    close(); // Close sidebar on mobile
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <X
        className="absolute top-4 right-4 text-white h-7 w-7 cursor-pointer bg-black/40 rounded p-1"
        onClick={close}
      />

      <div className="h-40 bg-gradient-to-r from-[#0074A8] to-[#5AC95A] p-4 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
             <User className="w-full h-full text-gray-400 p-2" />
        </div>
        <p className="text-white font-medium text-lg">Seller Account</p>
      </div>

      <div className="px-8 mt-6 space-y-3 text-gray-700 font-medium">
        <p className="cursor-pointer hover:text-blue-600 transition" onClick={() => navTo("/seller/dashboard")}>
          Dashboard
        </p>
        <p className="cursor-pointer hover:text-blue-600 transition" onClick={() => navTo("/seller/inventory")}>
          Product & Inventory Management
        </p>
        <p className="cursor-pointer hover:text-blue-600 transition" onClick={() => navTo("/seller/order-management")}>
          Order Management
        </p>
        <p className="cursor-pointer hover:text-blue-600 transition">Reviews & Ratings</p>
      </div>

      <div className="px-8 mt-12 space-y-6 text-gray-700 border-t pt-6">
        <div className="flex gap-3 items-center cursor-pointer hover:text-blue-600 transition">
          <User size={18} />
          <p>Help & Contact Us</p>
        </div>
        <div className="flex gap-3 items-center cursor-pointer hover:text-blue-600 transition">
          <Info size={18} />
          <p>About Us</p>
        </div>
        <div 
          className="flex gap-3 items-center cursor-pointer text-red-600 font-bold hover:bg-red-50 p-2 rounded-lg" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <p>Log out</p>
        </div>
      </div>
    </div>
  );
}