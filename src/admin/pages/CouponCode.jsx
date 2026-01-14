import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Trash2, ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import "./BarChart/CouponCode.css";

export default function CouponCode() {
  const [coupon, setCoupon] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [minOrder, setMinOrder] = useState("500");
  const [usage, setUsage] = useState("Single Time");
  const [applyOn, setApplyOn] = useState("All Products");

  const [generated, setGenerated] = useState([
    "Dis1022",
    "Dis0100",
    "New1245",
    "Kal1245",
  ]);

  const [copiedCode, setCopiedCode] = useState("");
  const navigate = useNavigate();

  const createCoupon = () => {
    if (!coupon.trim()) return;
    setGenerated([coupon, ...generated]);
    setCoupon("");
  };

  const deleteCoupon = (code) => {
    setGenerated(generated.filter((c) => c !== code));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="coupon-container">
      {/* Header */}
      <div className="coupon-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Coupon Management</h2>
      </div>

      {/* Creation Card */}
      <div className="creation-card">
        <h3>Create New Coupon</h3>
        <div className="input-grid">
          <div className="input-group">
            <label>Coupon Code</label>
            <input
              type="text"
              placeholder="e.g. SUMMER50"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option>Percentage</option>
              <option>Flat Amount</option>
              <option>Free Shipping</option>
            </select>
          </div>

          <div className="input-group">
            <label>Min. Order Value</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Usage Limit</label>
            <select value={usage} onChange={(e) => setUsage(e.target.value)}>
              <option>Single Time</option>
              <option>Unlimited</option>
              <option>First Order Only</option>
            </select>
          </div>

          <div className="input-group">
            <label>Applicable On</label>
            <input
              type="text"
              value={applyOn}
              onChange={(e) => setApplyOn(e.target.value)}
            />
          </div>

          <div className="input-group btn-container">
            <button className="create-btn" onClick={createCoupon}>
              <PlusCircle size={18} /> Create Coupon
            </button>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="list-section">
        <h3 className="section-title">Active Coupons</h3>
        <div className="coupon-grid">
          {generated.map((code, index) => (
            <div className="coupon-card" key={index}>
              <div className="coupon-info">
                <span className="coupon-badge">{code}</span>
                {copiedCode === code && (
                  <span className="copied-toast">
                    <CheckCircle size={14} /> Copied
                  </span>
                )}
              </div>
              <div className="card-actions">
                <button className="icon-btn copy" onClick={() => copyCode(code)} title="Copy Code">
                  <Copy size={18} />
                </button>
                <button className="icon-btn delete" onClick={() => deleteCoupon(code)} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}