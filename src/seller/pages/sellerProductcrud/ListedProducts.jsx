"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Package,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchListedProducts, deleteSellerProduct ,updateSellerProduct, } from "../../api/listedProductApi";
// import { deleteListedProduct } from "../../api/listedProductApi"; // <-- connect your delete API here
import ResubmitProductModal from "../../pages/sellerProductcrud/ResubmitProductModal";

// API se status boolean (true/false) aa raha hai, isliye boolean bhi handle kiya hai
const isActiveStatus = (status) => {
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1; // 1 = active, 0 = inactive
  const value = status?.toString().toLowerCase();
  return value === "active" || value === "1" || value === "true";
};

// resubmit true / 1 / "1" / "true" sab handle karega
const canResubmit = (item) => {
  const value = item?.resubmit;
  return value === true || value === 1 || value === "1" || value === "true";
};

const isApproved = (item) => {
  return (
    item?.is_approved === 1 ||
    item?.is_approved === true ||
    item?.is_approved === "1"
  );
};

export default function ListedProducts() {
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resubmit modal
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const stats = useMemo(() => {
    if (!products.length) return { active: 0, inactive: 0 };

    return {
      active: products.filter((p) => isActiveStatus(p.status)).length,
      inactive: products.filter((p) => !isActiveStatus(p.status)).length,
    };
  }, [products]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchListedProducts();

      if (res.success || res.status) {
        const rawData = Array.isArray(res.data) ? res.data : [];

        // --- SORTING LOGIC: Newest products at the top ---
        const sortedData = [...rawData].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setProducts(sortedData);
      } else {
        setError("Failed to fetch products from server.");
      }
    } catch (err) {
      console.error("Load Error:", err);
      setError("Failed to load listed products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = (item) => {
    setSelectedProduct(item);
    setShowResubmitModal(true);
  };


const handleResubmitSubmit = async ({ productId, formData }) => {
  try {
    const response = await updateSellerProduct(productId, formData);

    if (response.success || response.status) {
      setShowResubmitModal(false);
      setSelectedProduct(null);
      setProducts((prev) =>
  prev.map((p) => (p.id === productId ? { ...p, resubmit: false } : p))
);
      setToast("Product resubmitted successfully!");
      setTimeout(() => setToast(""), 3000);
      loadData();
    } else {
      setError(response.message || "Failed to resubmit product.");
    }
  } catch (err) {
    console.error("Resubmit Error:", err);
    setError(
      err.response?.data?.message || "Failed to resubmit product. Please try again."
    );
    throw err;
  }
};
  const handleDeleteClick = (item) => {
    setProductToDelete(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);

      const response = await deleteSellerProduct(productToDelete.id);

      if (response.success || response.status) {
        setProducts((prev) =>
          prev.filter((p) => p.id !== productToDelete.id)
        );

        setShowDeleteModal(false);
        setProductToDelete(null);

        setToast("Product deleted successfully!");

        setTimeout(() => {
          setToast("");
        }, 3000);
      } else {
        setError(response.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setError(
        err.response?.data?.message || "Failed to delete product. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };
  // Resubmit button (desktop + mobile dono me use hota hai)
  const renderResubmitButton = (item, fullWidth = false) => {
 if (!canResubmit(item)) {
  return isApproved(item) ? (
    <span className="text-gray-300 text-sm">—</span>
  ) : (
    <span className="inline-flex h-9 items-center rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700">
      Under Review
    </span>
  );
}

    return (
      <button
        onClick={() => handleResubmit(item)}
        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white ${fullWidth ? "w-full" : ""
          }`}
      >
        <RefreshCw size={13} />
        Resubmit
      </button>
    );
  };

  // Delete button (desktop + mobile dono me use hota hai)
  const renderDeleteButton = (item, fullWidth = false) => (
    <button
      onClick={() => handleDeleteClick(item)}
      title="Delete product"
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:border-red-600 hover:bg-red-600 hover:text-white ${fullWidth ? "w-full" : ""
        }`}
    >
      <Trash2 size={13} />
      Delete
    </button>
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full px-4 sm:px-8 py-8 font-sans">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100]">
          <div className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
            <CheckCircle2 size={20} />
            {toast}
          </div>
        </div>
      )}
      {/* ---------- HEADER ---------- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
            title="Go Back"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Listed Products
            </h2>
            <p className="text-xs text-gray-500">
              Manage your product catalog visibility
            </p>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="flex gap-3">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-green-100 shadow-sm min-w-30">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Active
              </p>
              <p className="text-xl font-bold text-gray-800 leading-none">
                {stats.active}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-red-100 shadow-sm min-w-30">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Inactive
              </p>
              <p className="text-xl font-bold text-gray-800 leading-none">
                {stats.inactive}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
          <button onClick={loadData} className="ml-auto text-sm underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* ---------- MAIN TABLE CONTAINER ---------- */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks / Reason</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length > 0 ? (
                  products.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        #{item.product_uid || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isActiveStatus(item.status) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm italic">
                        {item.reject_reason || item.reason || "No remarks available"}
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-2">
                          {renderResubmitButton(item)}

                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase ${isApproved(item)
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {isApproved(item) ? "Approved" : "Unapproved"}
                          </span>

                          {/* DELETE BUTTON - Approved/Unapproved ke baad */}
                          {renderDeleteButton(item)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Package size={40} className="opacity-20" />
                        <p>No products found in your catalog</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- MOBILE VIEW ---------- */}
          <div className="sm:hidden divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((item, index) => (
                <div key={item.id || index} className="p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      #{item.product_uid || "N/A"}
                    </span>
                    {isActiveStatus(item.status) ? (
                      <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">Reason:</span>{" "}
                      {item.reject_reason || item.reason || "N/A"}
                    </p>
                  </div>

                  {/* Approved / Unapproved badge (mobile) */}
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase ${isApproved(item)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {isApproved(item) ? "Approved" : "Unapproved"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {canResubmit(item) && (
                      <div className="flex-1">{renderResubmitButton(item, true)}</div>
                    )}
                    <div className="flex-1">{renderDeleteButton(item, true)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">No products found</div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Showing {products.length} products listed in your catalog
        </p>
      </div>

      {/* ---------- RESUBMIT MODAL ---------- */}
      <ResubmitProductModal
        isOpen={showResubmitModal}
        product={selectedProduct}
        onClose={() => setShowResubmitModal(false)}
        onSubmit={handleResubmitSubmit}
      />

      {/* ---------- DELETE CONFIRMATION POPUP ---------- */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeDeleteModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDeleteModal}
              disabled={deleting}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={26} className="text-red-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-800">Delete Product</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete
                {productToDelete?.name ? (
                  <span className="font-semibold text-gray-700">
                    {" "}
                    "{productToDelete.name}"
                  </span>
                ) : (
                  " this product"
                )}
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}