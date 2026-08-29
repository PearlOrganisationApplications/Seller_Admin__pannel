"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import KalkiLogo from "../assets/Kalki_logo.png";
import {
  X,
  User,
  Info,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Star,
  Headphones,
  Settings2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SellerSidebar({ isOpen, close }) {
  const navigate = useNavigate();
  const location = useLocation();
const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navTo = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) close();
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      icon: <LayoutDashboard size={22} />,
      label: "Dashboard",
      path: "/seller/dashboard",
    },
    {
      icon: <ShoppingBag size={22} />,
      label: "Inventory",
      path: "/seller/inventory",
    },
    {
      icon: <ClipboardList size={22} />,
      label: "Orders",
      path: "/seller/order-management",
    },
    {
      icon: <Settings2 size={22} />,
      label: "Order Management",
      path: "/seller/managment",
    },
    {
      icon: <Star size={22} />,
      label: "Reviews & Ratings",
      path: "/seller/reviews",
    },
    {
      icon: <Star size={22} />,
      label: "Rate Admin Panel",
      path: "/seller/platform-rating",
    },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: -320,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const containerVariants = {
    open: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-purple-950/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-[300px] z-50 flex flex-col
bg-gradient-to-b from-white via-purple-50 to-white
border-r border-purple-100 shadow-[20px_0_50px_rgba(168,85,247,0.12)]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-purple-100/50 rounded-full blur-[100px]" />
        </div>

        <button
          onClick={close}
          className="lg:hidden absolute top-6 right-6 z-50 h-9 w-9 rounded-xl
          bg-white border border-purple-100 flex items-center justify-center
          text-purple-500 hover:bg-purple-700 hover:border-purple-700 hover:text-white transition-all duration-300"
        >
          <X size={20} />
        </button>
<div className="relative px-8 pt-8 pb-6">
  <div className="flex items-center gap-3">
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      className="h-14 w-14 rounded-2xl bg-white shadow-md shadow-purple-200 border border-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0"
    >
      <img
        src={KalkiLogo}
        alt="Kalki Logo"
        className="w-full h-full object-contain p-1.5"
      />
    </motion.div>

      <h2 className="text-violet-500 text-[17px] font-bold tracking-wide whitespace-nowrap">
        Seller Panel
      </h2>
    </div>
  </div>


        <motion.div
          variants={containerVariants}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar relative"
        >
          {menuItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <NavItem
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
                onClick={() => navTo(item.path)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="p-6 mt-auto border-t border-purple-100 space-y-2 bg-white/50">
          <NavItem
            icon={<Headphones size={20} />}
            label="Support Center"
            onClick={() => navTo("/seller/help")}
          />
          <NavItem
            icon={<Info size={20} />}
            label="Platform Info"
            onClick={() => navTo("/seller/about")}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full mt-4 flex items-center justify-between px-5 py-4 rounded-2xl
bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 border border-purple-400/40
text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-900
transition-all duration-300 group shadow-lg shadow-purple-300/40"
          >
            <div className="flex items-center gap-3">
              <LogOut
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="font-bold text-sm tracking-wide">
                Secure Logout
              </span>
            </div>
            <ChevronRight
              size={18}
              className="opacity-50 group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </div>
      </motion.div>
<AnimatePresence>
  {showLogoutConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-purple-950/40 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-[90%] max-w-sm rounded-3xl overflow-hidden
        bg-gradient-to-b from-white via-purple-50 to-white
        border border-purple-100 shadow-[0_20px_60px_rgba(168,85,247,0.35)]"
      >
        {/* decorative glow blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-purple-300/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-40 h-40 bg-purple-400/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative px-7 pt-8 pb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800
            flex items-center justify-center shadow-lg shadow-purple-300/50 mb-4"
          >
            <LogOut size={28} className="text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-purple-900 mb-1.5">
            Secure Logout
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Are you sure you want to end your session? <br /> You'll need to sign in again to continue.
          </p>
        </div>

        <div className="relative flex gap-3 px-7 pb-7">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 text-purple-600 font-bold text-sm
            hover:bg-purple-50 transition-all duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white
            bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800
            hover:from-purple-600 hover:via-purple-700 hover:to-purple-900
            shadow-md shadow-purple-300/50 transition-all duration-200
            flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { 
              background: rgba(168,85,247,0.25); 
              border-radius: 10px; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(147,51,234,0.5); }
          `,
        }}
      />
    </>
  );
}

function NavItem({ icon, label, active, onClick, minimal = false }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
      ${
        active
          ? "bg-gradient-to-r from-purple-50 via-white to-purple-200 text-purple-900 border border-purple-300 shadow-[0_14px_40px_rgba(168,85,247,0.3)] backdrop-blur-sm"
          : minimal
            ? "text-purple-400 hover:text-white hover:bg-purple-600"
            : "text-gray-600 hover:bg-purple-600 hover:text-white border border-transparent hover:border-purple-600"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 rounded-2xl bg-purple-300/20 blur-md -z-10"
        />
      )}

      <div className="flex items-center gap-4">
        <div
          className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
        >
          {icon}
        </div>
        <span
          className={`text-[17px] font-semibold tracking-wide ${active ? "text-purple-900" : "text-inherit"}`}
        >
          {label}
        </span>
      </div>

      {!minimal && (
        <ChevronRight
          size={16}
          className={`transition-all duration-300 ${
            active
              ? "opacity-100 translate-x-0 text-purple-600"
              : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
          }`}
        />
      )}
    </motion.div>
  );
}