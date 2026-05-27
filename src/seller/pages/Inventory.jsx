import React from "react";
import {
  Plus,
  ChevronLeft,
  List,
  FileText,
  Award,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-11">
      {/* ================= ATTRATIVE HEADER ================= */}
      <div className="relative w-full bg-[#0B1E3A] px-4 pt-6 pb-7 rounded-b-[3rem] shadow-2xl overflow-hidden">
        {/* Decorative background circles for premium look */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Inventory Hub
            </h1>
            <p className="text-blue-200 mt-2 text-lg font-medium">
              Manage your listings, stock, and certifications
            </p>
          </div>

          <button
            onClick={() => navigate("/seller/dashboard")}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-[#0B1E3A] rounded-full
            hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-blue-500/20"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* ================= BUTTON CONTAINER ================= */}
      <div className="max-w-2xl mx-auto w-full px-6 mt-16">
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-3">
          {/* Add New Products */}
          <button
            onClick={() => navigate("/seller/product-listing")}
            className="w-full bg-[#4266FF] text-white py-4 px-6 rounded-xl
            hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5
            transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 font-bold text-[16px]">
              <div className="bg-white/20 p-2 rounded-lg">
                <Plus size={20} />
              </div>
              Add New Products
            </div>
            <ChevronLeft className="w-5 h-5 rotate-180 opacity-70" />
          </button>

          {/* Navigational Options */}
          {[
            {
              label: "My listed Products (Approved/Unapproved)",
              icon: List,
              path: "/seller/listed-products",
              color: "text-blue-500",
            },
            {
              label: "My listed Products (All details)",
              icon: FileText,
              path: "/seller/all-details",
              color: "text-blue-500",
            },
            {
              label: "Request for Kalki Certified",
              icon: Award,
              path: "/seller/request-certified",
              color: "text-emerald-500",
            },
            {
              label: "Kalki Certified (Approved/Unapproved)",
              icon: CheckCircle,
              path: "/seller/certified-products",
              color: "text-emerald-500",
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="w-full bg-white border border-transparent hover:border-gray-200 text-gray-700 py-4 px-6 rounded-xl
              hover:bg-gray-50 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 font-semibold text-[15px]">
                <item.icon size={20} className={item.color} />
                {item.label}
              </div>
              <ChevronLeft className="w-5 h-5 rotate-180 opacity-0 group-hover:opacity-40 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
