"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-[300px] z-50 flex flex-col
bg-[#2F394F]
border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <button
          onClick={close}
          className="lg:hidden absolute top-6 right-6 z-50 h-9 w-9 rounded-xl
          bg-white/5 border border-white/10 flex items-center justify-center
          text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="relative px-8 pt-10 pb-8">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 
              flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <User size={32} className="text-white" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#090E1A] flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-[#090E1A]" />
              </div>
            </motion.div>
            <div>
              <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md border border-white/10 inline-block">
                <h2 className="text-white text-lg font-extrabold tracking-wide opacity-100 relative z-50">
                  Seller Panel
                </h2>
              </div>
            </div>
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

        <div className="p-6 mt-auto border-t border-white/5 space-y-2 bg-[#0C1222]/50">
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
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-between px-5 py-4 rounded-2xl
bg-red-600 border border-red-400
text-white hover:bg-red-700
transition-all duration-300 group shadow-lg"
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { 
              background: rgba(255,255,255,0.1); 
              border-radius: 10px; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
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
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
          : minimal
            ? "text-slate-400 hover:text-white"
            : "text-slate-400 hover:bg-white hover:text-black border border-transparent hover:border-white"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-md -z-10"
        />
      )}

      <div className="flex items-center gap-4">
        <div
          className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
        >
          {icon}
        </div>
        <span
          className={`text-[17px] font-semibold tracking-wide ${active ? "text-white" : "text-inherit"}`}
        >
          {label}
        </span>
      </div>

      {!minimal && (
        <ChevronRight
          size={16}
          className={`transition-all duration-300 ${
            active
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
          }`}
        />
      )}
    </motion.div>
  );
}
