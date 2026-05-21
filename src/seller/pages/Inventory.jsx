import React from "react";
import {
  Plus,
  ChevronLeft,
  Package,
  List,
  FileText,
  Award,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    // Removed m-4 to prevent gaps; added max-width for better desktop viewing
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col min-h-screen pl-8 pt-4">
      {" "}
      {/* ================= HEADER ================= */}
      <div className="w-full mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Product & Inventory Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your listings, stock, and certifications
            </p>
          </div>

          <button
            onClick={() => navigate("/seller/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg
            hover:bg-gray-200 transition-all w-fit font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
      </div>
      {/* ================= BUTTON CONTAINER ================= */}
      {/* Increased gap and used a max-width container to keep things centered but tidy */}
      <div className="flex flex-col items-center gap-4 mt-4 max-w-2xl mx-auto w-full">
        {/* Add New Products */}
        <button
          onClick={() => navigate("/seller/product-listing")}
          className="w-full bg-[#4266FF] text-white py-4 px-6 rounded-xl
          hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1
          transition-all duration-200 flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-3 font-bold text-[16px]">
            <Plus size={20} className="bg-white/20 rounded-md p-0.5" />
            Add New Products
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* My Listed Products (Approved) */}
        <button
          onClick={() => navigate("/seller/listed-products")}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-xl
          hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30
          transition-all duration-200 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3 font-semibold text-[15px]">
            <List size={18} className="text-blue-500" />
            My listed Products (Approved/Unapproved)
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 opacity-30 group-hover:opacity-100" />
        </button>

        {/* My Listed Products (All Details) */}
        <button
          onClick={() => navigate("/seller/all-details")}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-xl
          hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30
          transition-all duration-200 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3 font-semibold text-[15px]">
            <FileText size={18} className="text-blue-500" />
            My listed Products (All details)
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 opacity-30 group-hover:opacity-100" />
        </button>

        {/* Request Certified */}
        <button
          onClick={() => navigate("/seller/request-certified")}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-xl
          hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/30
          transition-all duration-200 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3 font-semibold text-[15px]">
            <Award size={18} className="text-emerald-500" />
            Request for Kalki Certified
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 opacity-30 group-hover:opacity-100" />
        </button>

        {/* Certified Products Status */}
        <button
          onClick={() => navigate("/seller/certified-products")}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-xl
          hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/30
          transition-all duration-200 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3 font-semibold text-[15px]">
            <CheckCircle size={18} className="text-emerald-500" />
            Kalki Certified (Approved/Unapproved)
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 opacity-30 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
