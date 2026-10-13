import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaUserTie,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// Controllers (API layer)
import {
  getProductsController,
  approveProductController,
  rejectProductController,
} from "../api/seller-approval";

const SellerApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approveLoading, setApproveLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [resubmitAllowed, setResubmitAllowed] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProductsController();

      if (result.success) {
        setProducts(result.products);
      } else {
        setProducts([]);
        setError(result.message);
      }
    } catch (err) {
      console.error("Seller Approval API Error:", err);
      setError(err.message || "Unable to fetch seller approval data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleView = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleApprove = (product) => {
    setSelectedProduct(product);
    setApprovalAction("approve");
    setShowApprovalModal(true);
  };

  const handleReject = (product) => {
    setSelectedProduct(product);
    setApprovalAction("reject");
    setRejectReason("");
    setResubmitAllowed(false);
    setShowApprovalModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedProduct?.id || !approvalAction) return;

    // Reject reason validation
    if (approvalAction === "reject" && !rejectReason.trim()) {
      toast.error("Please enter reject reason");
      return;
    }

    try {
      setApproveLoading(selectedProduct.id);

      // APPROVE controller
      if (approvalAction === "approve") {
        await approveProductController(selectedProduct.id);
      }

      if (approvalAction === "reject") {
        await rejectProductController(
          selectedProduct.id,
          rejectReason,
          resubmitAllowed
        );
      }

      // Update product status locally (product list me hi rahega)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? approvalAction === "approve"
              ? { ...product, is_approved: 1, reject_reason: null }
              : { ...product, is_approved: 0, reject_reason: rejectReason.trim() }
            : product
        )
      );

      // Close modal
      setShowApprovalModal(false);
      setSelectedProduct(null);
      setApprovalAction(null);
      setRejectReason("");

      // Toast
      toast.success(
        approvalAction === "approve"
          ? "Approved successfully"
          : "Rejected successfully"
      );
    } catch (err) {
      console.error("Product Approval Error:", err);

      toast.error(
        err.message ||
          `Something went wrong while ${
            approvalAction === "approve" ? "approving" : "rejecting"
          } product`
      );
    } finally {
      setApproveLoading(null);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Approval</h1>

          <p className="text-sm text-gray-500 mt-1">
            Review pending seller product approvals
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
          <span className="text-gray-500 text-sm">Pending Requests: </span>

          <span className="font-bold text-orange-600">
            {
              products.filter(
                (p) => Number(p.is_approved) === 0 && !p.reject_reason
              ).length
            }
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
          <FaUserTie className="mx-auto text-4xl text-gray-300 mb-3" />

          <h3 className="text-lg font-semibold text-gray-700">
            No Pending Seller Approvals
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            There are currently no products waiting for approval.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && products.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-0 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Seller
                  </th>

                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>

                  {/* ACTION HEADER - centered */}
                  <th
                    style={{ textAlign: "center" }}
                    className="min-w-[260px] px-5 py-4 font-semibold text-gray-700"
                  >
                    <div className="flex w-full items-center justify-center">
                      Action
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => {
                  const seller = product.seller || {};

                  const image =
                    Array.isArray(product.image) && product.image.length > 0
                      ? product.image[0]
                      : null;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name || "Product"}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                              <FaEye />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-800">
                              {product.name || "N/A"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {product.product_uid || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {seller.name || "N/A"}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-600">
                        {seller.email || "N/A"}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-gray-700">
                          {product.category?.category || "N/A"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          ₹{product.price || "0"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            Number(product.is_approved) === 1
                              ? "bg-green-100 text-green-700"
                              : product.reject_reason
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {Number(product.is_approved) === 1
                            ? "Approved"
                            : product.reject_reason
                            ? "Rejected"
                            : "Pending"}
                        </span>
                      </td>

                      {/* Actions - centered */}
                      <td className="min-w-[260px] px-5 py-4 whitespace-nowrap">
                        {(() => {
                          const isApproved = Number(product.is_approved) === 1;
                          const isRejected =
                            Number(product.is_approved) === 0 &&
                            !!product.reject_reason;
                          const isPending =
                            Number(product.is_approved) === 0 &&
                            !product.reject_reason;

                          const canApprove = isPending || isRejected;
                          const canReject = isPending || isApproved;
                          const busy =
                            approveLoading === product.id ||
                            rejectLoading === product.id;

                          return (
                            <div className="flex w-full items-center justify-center gap-2">
                              {/* VIEW - icon only */}
                              <button
                                onClick={() => handleView(product)}
                                title="View details"
                                aria-label="View details"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <FaEye className="text-sm" />
                              </button>

                              {/* Divider */}
                              <span className="h-6 w-px bg-gray-200" />

                              {/* APPROVE */}
                              {canApprove && (
                                <button
                                  onClick={() => handleApprove(product)}
                                  disabled={busy}
                                  className="flex h-9 w-[96px] items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 text-xs font-semibold text-green-700 transition hover:border-green-600 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {approveLoading === product.id ? (
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <FaCheck className="text-[11px]" />
                                  )}
                                  {approveLoading === product.id
                                    ? "Wait..."
                                    : "Approve"}
                                </button>
                              )}

                              {/* REJECT */}
                              {canReject && (
                                <button
                                  onClick={() => handleReject(product)}
                                  disabled={busy}
                                  className="flex h-9 w-[88px] items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <FaTimes className="text-[11px]" />
                                  Reject
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL */}
      {showApprovalModal && selectedProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    approvalAction === "approve" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {approvalAction === "approve" ? (
                    <FaCheck className="text-green-600 text-lg" />
                  ) : (
                    <FaTimes className="text-red-600 text-lg" />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {approvalAction === "approve"
                      ? "Approve Product"
                      : "Reject Product"}
                  </h2>

                  <p className="text-sm text-gray-500">Confirmation required</p>
                </div>
              </div>
            </div>

            {/* Resubmit Toggle */}
            <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Allow Resubmission
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Allow the seller to update and resubmit this product.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={resubmitAllowed}
                onClick={() => setResubmitAllowed((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  resubmitAllowed ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    resubmitAllowed ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <p className="mt-2 text-right text-xs font-medium">
              <span
                className={resubmitAllowed ? "text-green-600" : "text-gray-500"}
              >
                {resubmitAllowed
                  ? "Resubmission Allowed"
                  : "Resubmission Not Allowed"}
              </span>
            </p>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <p className="text-gray-700 text-sm leading-6">
                Are you sure you want to{" "}
                <span className="font-semibold">
                  {approvalAction === "approve" ? "approve" : "reject"}
                </span>{" "}
                this product?
              </p>

              <div className="mt-4 bg-gray-50 border rounded-lg p-3">
                <p className="font-semibold text-gray-800">
                  {selectedProduct.name || "N/A"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedProduct.product_uid || "N/A"}
                </p>
              </div>

              {approvalAction === "reject" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reject Reason
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejecting this product"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              {/* Cancel */}
              <button
                onClick={() => {
                  if (approveLoading === null) {
                    setShowApprovalModal(false);
                    setSelectedProduct(null);
                    setApprovalAction(null);
                    setRejectReason("");
                  }
                }}
                disabled={approveLoading !== null}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                onClick={confirmApproval}
                disabled={
                  approveLoading !== null ||
                  (approvalAction === "reject" && !rejectReason.trim())
                }
                className={`px-4 py-2.5 rounded-lg text-white text-sm font-medium transition flex items-center gap-2 ${
                  approvalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                    : "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                }`}
              >
                {approveLoading !== null ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                    {approvalAction === "approve"
                      ? "Approving..."
                      : "Rejecting..."}
                  </>
                ) : (
                  <>
                    {approvalAction === "approve" ? (
                      <>
                        <FaCheck />
                        Yes, Approve
                      </>
                    ) : (
                      <>
                        <FaTimes />
                        Yes, Reject
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT VIEW MODAL */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Product Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {viewProduct.product_uid || "N/A"}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewProduct(null);
                }}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {/* Product Images + Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Product Images
                  </h3>

                  {Array.isArray(viewProduct.image) &&
                  viewProduct.image.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {viewProduct.image.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${viewProduct.name} ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Basic Details */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Product Name</p>
                      <p className="font-semibold text-gray-800">
                        {viewProduct.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Product UID</p>
                      <p className="text-gray-700">
                        {viewProduct.product_uid || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Brand</p>
                      <p className="text-gray-700">
                        {viewProduct.brand || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Description</p>
                      <p className="text-gray-700">
                        {viewProduct.description || "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-gray-700">
                          {viewProduct.category?.category || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Subcategory</p>
                        <p className="text-gray-700">
                          {viewProduct.subcategory?.subcategory || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Details */}
              <div className="mt-6 border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Seller Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Seller Name</p>
                    <p className="font-medium text-gray-800">
                      {viewProduct.seller?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-700">
                      {viewProduct.seller?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-700">
                      {viewProduct.seller?.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Business Name</p>
                    <p className="text-gray-700">
                      {viewProduct.seller?.business_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Business Type</p>
                    <p className="text-gray-700">
                      {viewProduct.seller?.business_type || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">GST Number</p>
                    <p className="text-gray-700">
                      {viewProduct.seller?.gst_number || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Pricing & Stock
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Cost Price</p>
                    <p className="font-semibold">
                      ₹{viewProduct.cost_price || "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">MRP</p>
                    <p className="font-semibold">₹{viewProduct.mrp || "0"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Selling Price</p>
                    <p className="font-semibold">₹{viewProduct.price || "0"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Final Price</p>
                    <p className="font-semibold">
                      ₹{viewProduct.final_price || "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Shipping Fee</p>
                    <p className="font-semibold">
                      ₹{viewProduct.shipping_fee || "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Platform Fee</p>
                    <p className="font-semibold">
                      ₹{viewProduct.platform_fee || "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="font-semibold">
                      {viewProduct.discount || "0%"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className="font-semibold">{viewProduct.stock ?? 0}</p>
                  </div>
                </div>
              </div>

              {/* Return Details */}
              <div className="mt-6 border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Return & Product Status
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Approval</p>
                    <span className="inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {Number(viewProduct.is_approved) === 1
                        ? "Approved"
                        : "Pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Product Status</p>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        Number(viewProduct.is_approved) === 1
                          ? "bg-green-100 text-green-700"
                          : viewProduct.reject_reason
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {Number(viewProduct.is_approved) === 1
                        ? "Approved"
                        : viewProduct.reject_reason
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Allow Return</p>
                    <p className="font-medium text-gray-800">
                      {viewProduct.allow_return ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Return Window</p>
                    <p className="font-medium text-gray-800">
                      {viewProduct.return_window_days ?? 0} days
                    </p>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="mt-6 border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Variants</h3>

                {Array.isArray(viewProduct.variants) &&
                viewProduct.variants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Color ID</th>
                          <th className="px-4 py-3 text-left">Size ID</th>
                          <th className="px-4 py-3 text-left">Price</th>
                          <th className="px-4 py-3 text-left">Stock</th>
                          <th className="px-4 py-3 text-left">SKU</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {viewProduct.variants.map((variant) => (
                          <tr key={variant.id}>
                            <td className="px-4 py-3">{variant.id}</td>

                            <td className="px-4 py-3">
                              {variant.color_id ?? "N/A"}
                            </td>

                            <td className="px-4 py-3">
                              {variant.size_id ?? "N/A"}
                            </td>

                            <td className="px-4 py-3 font-medium">
                              ₹{variant.price || "0"}
                            </td>

                            <td className="px-4 py-3">{variant.stock ?? 0}</td>

                            <td className="px-4 py-3">
                              {variant.sku || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No variants available.
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="mt-6 border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Specifications
                </h3>

                {Array.isArray(viewProduct.specifications) &&
                viewProduct.specifications.length > 0 ? (
                  <div className="space-y-3">
                    {viewProduct.specifications.map((spec) => (
                      <div
                        key={spec.id}
                        className="flex flex-col md:flex-row md:items-center gap-2 bg-gray-50 rounded-lg p-3"
                      >
                        <span className="font-medium text-gray-800">
                          {spec.spec_key || "N/A"}
                        </span>

                        <span className="text-gray-600">
                          {spec.spec_value || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No specifications available.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewProduct(null);
                }}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerApproval;