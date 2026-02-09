import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Trash2, ArrowLeft, CheckCircle, PlusCircle, Loader2, Tag } from "lucide-react";
import toast from 'react-hot-toast';
import { getCoupons, addCoupon, deleteCouponApi } from "../api/couponApi";
import "./BarChart/CouponCode.css";

export default function CouponCode() {
  const [couponsList, setCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Input States
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("500");
  const [usageLimit, setUsageLimit] = useState(1);
  const [productId, setProductId] = useState(""); // New State for target product

  const [copiedCode, setCopiedCode] = useState("");
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCouponsList(data.coupons || data.data || []);
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
    // 1. Validation
    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!discountValue || discountValue <= 0) {
      toast.error("Please enter a valid percentage");
      return;
    }

    const payload = {
      code: code.toUpperCase().replace(/\s+/g, ''),
      discount_type: "percentage", // Always percentage
      discount_value: Number(discountValue),
      minimal_order_value: Number(minOrder),
      usage_limit: Number(usageLimit),
      // If productId is provided, set to 'product', else 'all'
      applicable_on: productId.trim() ? "product" : "all",
      applicable_product_id: productId.trim() ? productId.trim() : null,
      applicable_category_id: null
    };

    const loadToast = toast.loading("Creating coupon...");
    
    try {
      const response = await addCoupon(payload);

      // Refined Success Check based on your API response structure
      if (response.coupon || response.message?.toLowerCase().includes("success")) {
        toast.success(response.message || "Coupon created successfully!", { id: loadToast });
        
        // Reset Form
        setCode("");
        setDiscountValue("");
        setMinOrder("500");
        setUsageLimit(1);
        setProductId("");
        
        // Refresh List
        fetchCoupons(); 
      } else {
        toast.error(response.message || "Failed to create coupon", { id: loadToast });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server Error: Failed to create";
      toast.error(errorMsg, { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const loadToast = toast.loading("Deleting...");
      try {
        const res = await deleteCouponApi(id);
        toast.success(res.message || "Coupon deleted", { id: loadToast });
        fetchCoupons();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed", { id: loadToast });
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
      <div className="coupon-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Coupon Management</h2>
      </div>

      <div className="creation-card">
        <h3>Create New Percentage Coupon</h3>
        <div className="input-grid">
          <div className="input-group">
            <label>Coupon Code *</label>
            <input 
              type="text" 
              placeholder="e.g. DISK40" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Discount Percentage (%) *</label>
            <input 
              type="number" 
              placeholder="e.g. 10" 
              value={discountValue} 
              onChange={(e) => setDiscountValue(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Apply to Product ID (Optional)</label>
            <input 
              type="text" 
              placeholder="Leave blank for all products" 
              value={productId} 
              onChange={(e) => setProductId(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Min. Order Value (₹)</label>
            <input 
              type="number" 
              value={minOrder} 
              onChange={(e) => setMinOrder(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Usage Limit</label>
            <input 
              type="number" 
              value={usageLimit} 
              onChange={(e) => setUsageLimit(e.target.value)} 
            />
          </div>

          <div className="input-group flex items-end">
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
            <Loader2 className="animate-spin text-[#632281]" size={40} />
          </div>
        ) : (
          <div className="coupon-grid">
            {couponsList.length > 0 ? (
              couponsList.map((cpn) => (
                <div className="coupon-card" key={cpn.id}>
                  <div className="coupon-info">
                    <div className="flex flex-col">
                      <span className="coupon-badge">{cpn.code}</span>
                      <small className="discount-text">
                        {parseFloat(cpn.discount_value)}% OFF
                      </small>
                      <div className="mt-1 flex flex-col gap-0.5">
                        <small className="min-order-sub">Min Order: ₹{cpn.minimal_order_value}</small>
                        <small className="target-text flex items-center gap-1">
                          <Tag size={10} /> {cpn.applicable_on === 'product' ? `Product ID: ${cpn.applicable_product_id}` : 'All Products'}
                        </small>
                      </div>
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
              ))
            ) : (
              <p className="no-data">No active coupons found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}