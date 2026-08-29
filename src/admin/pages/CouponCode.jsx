import React, { useState, useEffect } from "react";
import { Copy, Trash2, CheckCircle, PlusCircle, Loader2, Tag, TicketPercent } from "lucide-react";
import toast from "react-hot-toast";
import { getCoupons, addCoupon, deleteCouponApi } from "../api/couponApi";

export default function CouponCode() {
  const [couponsList, setCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("500");
  const [usageLimit, setUsageLimit] = useState(1);
  const [productId, setProductId] = useState("");

  const [copiedCode, setCopiedCode] = useState("");
const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
setCouponsList((data.coupons || data.data || []).reverse());    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!discountValue || discountValue <= 0) {
      toast.error("Please enter a valid percentage value");
      return;
    }

    const payload = {
      code: code.toUpperCase().replace(/\s+/g, ""),
      discount_type: "percentage",
      discount_value: Number(discountValue),
      minimal_order_value: Number(minOrder),
      usage_limit: Number(usageLimit),
      applicable_on: productId.trim() ? "product" : "all",
      applicable_product_id: productId.trim() ? productId.trim() : null,
      applicable_category_id: null,
    };

    const loadToast = toast.loading("Creating coupon...");

    try {
      const response = await addCoupon(payload);

      if (response.coupon || response.message?.toLowerCase().includes("success")) {
        toast.success(response.message || "Coupon created successfully!", { id: loadToast });

        setCode("");
        setDiscountValue("");
        setMinOrder("500");
        setUsageLimit(1);
        setProductId("");

        fetchCoupons();
      } else {
        toast.error(response.message || "Failed to create", { id: loadToast });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error: Could not create coupon";
      toast.error(errorMsg, { id: loadToast });
    }
  };

 const handleDelete = async (id) => {
    const loadToast = toast.loading("Deleting coupon...");
    try {
      const res = await deleteCouponApi(id);
      toast.success(res.message || "Coupon removed", { id: loadToast });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed", { id: loadToast });
    } finally {
      setConfirmDeleteId(null);
    }
};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success("Code copied!", { id: "copy-toast" });
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <TicketPercent className="text-white" size={26} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Coupon Management
        </h2>
      </div>

      <div className="rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800">Create New Percentage Coupon</h3>
        <p className="text-sm text-gray-500 mb-6">
          All coupons created here apply as a percentage discount.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">Coupon Code *</label>
            <input
              type="text"
              placeholder="e.g. SAVE50"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">Discount (%) *</label>
            <input
              type="number"
              placeholder="e.g. 25"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Specific Product ID (Optional)
            </label>
            <input
              type="text"
              placeholder="Empty for all products"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">Min. Order Value (₹)</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">Usage Limit</label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCreateCoupon}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:opacity-90 transition-all"
            >
              <PlusCircle size={18} /> Create Coupon
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Active Coupons</h3>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {couponsList.length > 0 ? (
              couponsList.map((cpn) => (
                <div
                  key={cpn.id}
                  className="relative rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-lg p-5 hover:shadow-xl hover:bg-white/70 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="inline-block w-fit px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold tracking-wide">
                        {cpn.code}
                      </span>
                      <small className="text-emerald-600 font-bold text-sm">
                        {parseFloat(cpn.discount_value)}% OFF
                      </small>
                      <div className="mt-2 flex flex-col gap-1">
                        <small className="font-semibold text-gray-500 text-xs">
                          Min: ₹{cpn.minimal_order_value}
                        </small>
                        <small
                          className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            cpn.applicable_on === "product"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          <Tag size={10} className="inline mr-1" />
                          {cpn.applicable_on === "product"
                            ? `ID: ${cpn.applicable_product_id}`
                            : "Global"}
                        </small>
                      </div>
                    </div>

                    {copiedCode === cpn.code && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                        <CheckCircle size={14} /> Copied
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      title="Copy Code"
                      onClick={() => copyToClipboard(cpn.code)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-300/40 hover:bg-indigo-500/20 transition-all text-xs font-medium"
                    >
                      <Copy size={14} /> Copy
                    </button>
                    <button
                      title="Delete Coupon"
onClick={() => setConfirmDeleteId(cpn.id)}                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 border border-red-300/40 hover:bg-red-500 hover:text-white transition-all text-xs font-medium"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-14 col-span-full">
                No active coupons available.
              </p>
            )}
          </div>
        )}
      </div>
      {confirmDeleteId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setConfirmDeleteId(null)}>
    <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="text-red-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Delete this coupon?</h3>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
      </div>
      <div className="flex border-t border-gray-100">
        <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}