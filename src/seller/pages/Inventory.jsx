import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  List,
  FileText,
  Award,
  CheckCircle,
  ChevronRight,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "My listed Products (Approved/Unapproved)",
      icon: List,
      path: "/seller/listed-products",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "My listed Products (All details)",
      icon: FileText,
      path: "/seller/all-details",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Request for Kalki Certified",
      icon: Award,
      path: "/seller/request-certified",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Kalki Certified (Approved/Unapproved)",
      icon: CheckCircle,
      path: "/seller/certified-products",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-purple-50 to-white overflow-hidden pb-16 pt-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[95%] mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white p-8 md:p-6 shadow-lg shadow-purple-100 border border-purple-100 overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="bg-purple-200/50 border border-purple-200 px-3 py-0.5 rounded-lg backdrop-blur-md inline-flex items-center gap-2">
                <Package size={16} className="text-purple-600" />
                <span className="text-purple-700 text-xs font-extrabold tracking-wider uppercase">
                  Seller Portal
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-wide">
                Inventory Hub
              </h1>
              <p className="text-purple-500 text-base font-medium">
                Manage your listings, stock, and certifications
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/seller/dashboard")}
              className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-100 backdrop-blur-md rounded-2xl transition-all duration-300 font-bold text-sm shadow-md hover:shadow-xl group self-start md:self-auto"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto mt-10 space-y-4"
        >
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.015, x: 4 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate("/seller/product-listing")}
              className="w-full relative group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-300 text-white shadow-lg shadow-purple-200 border border-purple-300/40 overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <Plus size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <span className="block font-extrabold text-lg tracking-wide">
                    Add New Products
                  </span>
                  <span className="text-xs text-purple-100 font-medium">
                    Create new product listings in store
                  </span>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-white opacity-80 group-hover:translate-x-1 transition-transform relative z-10"
              />
            </motion.button>
          </motion.div>

          <div className="bg-white/70 backdrop-blur-md p-3 rounded-3xl border border-purple-100 shadow-lg shadow-purple-100/60 space-y-2">
            {menuItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className="group flex items-center justify-between p-4 rounded-2xl cursor-pointer bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-purple-100/60 hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-100"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-11 w-11 rounded-xl ${item.bgColor} flex items-center justify-center transition-colors duration-300`}
                      >
                        <IconComponent
                          size={20}
                          className={`${item.color} transition-colors duration-300`}
                        />
                      </div>
                      <span className="font-semibold text-[16px] tracking-wide transition-colors duration-300">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-400 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}