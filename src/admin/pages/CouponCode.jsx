import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Trash2, ArrowLeft, CheckCircle, PlusCircle, Loader2 } from "lucide-react";
import toast from 'react-hot-toast'; // REMOVED Toaster from here
import { getCoupons, addCoupon, deleteCouponApi } from "../api/couponApi";
import "./BarChart/CouponCode.css";

export default function CouponCode() {
  const [couponsList, setCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("500");
  const [usageLimit, setUsageLimit] = useState(1);
  const [applicableOn, setApplicableOn] = useState("all");

  const [copiedCode, setCopiedCode] = useState("");
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCouponsList(data.coupons || []);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!code.trim() || !discountValue) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      minimal_order_value: Number(minOrder),
      usage_limit: Number(usageLimit),
      applicable_on: applicableOn,
      applicable_product_id: null,
      applicable_category_id: null
    };

    const loadToast = toast.loading("Creating coupon...");
    try {
      const response = await addCoupon(payload);
      // Adding ID 'coupon-action' ensures it replaces any previous toast
      toast.success(response.message || "Coupon created!", { id: loadToast });
      
      setCode("");
      setDiscountValue("");
      fetchCoupons(); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create coupon";
      toast.error(errorMsg, { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const loadToast = toast.loading("Deleting...");
      try {
        await deleteCouponApi(id);
        toast.success("Coupon deleted", { id: loadToast });
        fetchCoupons();
      } catch (error) {
        toast.error("Delete failed", { id: loadToast });
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success("Code copied!", { id: 'copy-toast' });
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="coupon-container">
      {/* DELETED LOCAL TOASTER FROM HERE */}
      
      <div className="coupon-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Coupon Management</h2>
      </div>

      <div className="creation-card">
        <h3>Create New Coupon</h3>
        <div className="input-grid">
          <div className="input-group">
            <label>Coupon Code</label>
            <input type="text" placeholder="DISK01" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Flat Amount (₹)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Discount Value</label>
            <input type="number" placeholder="10" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Min. Order Value</label>
            <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Usage Limit</label>
            <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
          </div>

          <div className="input-group">
            <button className="create-btn" onClick={handleCreateCoupon}>
              <PlusCircle size={18} /> Create Coupon
            </button>
          </div>
        </div>
      </div>

      <div className="list-section">
        <h3 className="section-title">Active Coupons</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="coupon-grid">
            {couponsList.map((cpn) => (
              <div className="coupon-card" key={cpn.id}>
                <div className="coupon-info">
                  <div className="flex flex-col">
                    <span className="coupon-badge">{cpn.code}</span>
                    <small className="discount-text">
                      {cpn.discount_type === 'percentage' ? `${parseFloat(cpn.discount_value)}% OFF` : `₹${parseFloat(cpn.discount_value)} OFF`}
                    </small>
                  </div>
                  {copiedCode === cpn.code && (
                    <span className="copied-toast">
                      <CheckCircle size={14} /> Copied
                    </span>
                  )}
                </div>
                <div className="card-actions">
                  <button className="icon-btn copy" onClick={() => copyToClipboard(cpn.code)}>
                    <Copy size={18} />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(cpn.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}