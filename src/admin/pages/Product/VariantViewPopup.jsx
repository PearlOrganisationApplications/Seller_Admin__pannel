import React from "react";
import { X, Package, Palette, Ruler } from "lucide-react";
import "./VariantViewPopup.css";

const VariantViewPopup = ({ variant, onClose }) => {
  if (!variant) return null;

  return (
    <div className="variant-popup-overlay" onClick={onClose}>
      <div
        className="variant-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="variant-popup-header">
          <div>
            <h2>Variant Details</h2>
            <p>View complete variant information</p>
          </div>

          <button
            className="variant-popup-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* PRODUCT */}
        <div className="variant-popup-product">
          <img
            src={
              variant.product?.image ||
              "https://placehold.co/100x100/png?text=Product"
            }
            alt={variant.product?.name || "Product"}
          />

          <div>
            <h3>{variant.product?.name || "N/A"}</h3>
            <span>
              Product UID: {variant.product?.product_uid || "N/A"}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="variant-details-grid">

          <div className="variant-detail-item">
            <span>Variant ID</span>
            <strong>#{variant.id}</strong>
          </div>

          <div className="variant-detail-item">
            <span>SKU</span>
            <strong>{variant.sku || "N/A"}</strong>
          </div>

          <div className="variant-detail-item">
            <span>Color</span>
            <strong>
              {variant.color?.color || "—"}
            </strong>
          </div>

          <div className="variant-detail-item">
            <span>Size</span>
            <strong>
              {variant.size?.size || "—"}
            </strong>
          </div>

          <div className="variant-detail-item">
            <span>Price</span>
            <strong>
              ₹{Number(variant.price || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="variant-detail-item">
            <span>Stock</span>
            <strong>{variant.stock ?? 0}</strong>
          </div>

          <div className="variant-detail-item">
            <span>Product Status</span>
            <strong>
              {variant.product?.status ? "Active" : "Inactive"}
            </strong>
          </div>

          <div className="variant-detail-item">
            <span>Product ID</span>
            <strong>{variant.product_id || "N/A"}</strong>
          </div>

        </div>

        {/* FOOTER */}
        <div className="variant-popup-footer">
          <button
            className="variant-popup-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantViewPopup;