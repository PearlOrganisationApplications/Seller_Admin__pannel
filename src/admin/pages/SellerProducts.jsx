"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getSellerProducts, updateProductStatus } from "../api/sellerApi";
import toast from "react-hot-toast"; // Import only toast, NOT Toaster

export default function SellerProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSellerProducts(id);

      // 1. SORT: Newest Created Products on Top (Descending)
      const sorted = (data.products || []).sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      setProducts(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (product_uid, currentStatus) => {
    const normalizedStatus = currentStatus.toLowerCase();
    const newStatus = normalizedStatus === "active" ? "inactive" : "active";

    try {
      setUpdatingUid(product_uid);
      const res = await updateProductStatus(product_uid, newStatus);

      console.log("API Response:", res); // <-- ADD THIS to check if status is true

      if (res.status === true || res.success === true) {
        setProducts((prev) =>
          prev.map((p) =>
            p.product_uid === product_uid ? { ...p, status: newStatus } : p
          )
        );

        toast.success(`Product ${newStatus.toUpperCase()} successfully`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setUpdatingUid(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">

      {/* Header Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Seller Products</h1>
            <p className="text-xs text-gray-500 font-medium">Viewing listed items for Seller ID: {id}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest border-b">
                  <th className="px-6 py-4 font-bold">Product Info</th>
                  <th className="px-6 py-4 font-bold hidden md:table-cell">Price & Stock</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Action</th>
                  <th className="px-6 py-4 font-bold hidden lg:table-cell">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                  products.map((p) => {
                    const isActive = p.status?.toLowerCase() === "active";

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{p.name}</div>
                          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">{p.product_uid}</div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="text-sm font-bold text-gray-700">₹{p.price}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Stock: {p.stock}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              disabled={updatingUid === p.product_uid}
                              onClick={() => handleStatusToggle(p.product_uid, p.status)}
                              className={`w-32 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center ${isActive
                                  ? 'bg-white border-red-200 text-red-500 hover:bg-red-50'
                                  : 'bg-white border-green-200 text-green-500 hover:bg-green-50'
                                } disabled:opacity-50`}
                            >
                              {updatingUid === p.product_uid ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                isActive ? "Deactivate" : "Activate"
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-400">
                          {new Date(p.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                      No products found for this seller.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}