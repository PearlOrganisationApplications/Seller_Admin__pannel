import React from "react";
import {
  FaStar,
  FaFire,
} from "react-icons/fa";

const DUMMY_IMAGE =
  "https://via.placeholder.com/500x500?text=No+Image";

export default function ProductDetailsModal({
  product,
  onClose,
  formatPrice,
}) {
  if (!product) return null;

  return (
    <div className="tax-modal-overlay" onClick={onClose}>
      <div
        className="tax-glass-modal product-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="tax-modal-header">
          <div>
            <h3>Product Details</h3>
            <p>{product.product_uid}</p>
          </div>

          <button
            type="button"
            className="tax-modal-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="tax-modal-body">

          {/* TOP */}
          <div className="product-modal-top">
            <img
              src={product.image || DUMMY_IMAGE}
              alt={product.name}
              className="product-modal-image"
              onError={(e) => {
                e.currentTarget.src = DUMMY_IMAGE;
              }}
            />

            <div className="product-modal-main">
              <h2>{product.name || "—"}</h2>

              <p>{product.slug || "—"}</p>

              <div className="product-modal-badges">
                <span
                  className={`tax-status-badge ${
                    product.status ? "active" : "inactive"
                  }`}
                >
                  {product.status ? "Active" : "Inactive"}
                </span>

                {product.is_featured && (
                  <span className="product-mini-tag featured">
                    <FaStar />
                    Featured
                  </span>
                )}

                {product.is_bestseller && (
                  <span className="product-mini-tag bestseller">
                    Bestseller
                  </span>
                )}

                {product.is_new && (
                  <span className="product-mini-tag new">
                    New
                  </span>
                )}

                {product.is_trending && (
                  <span className="product-mini-tag trending">
                    <FaFire />
                    Trending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="product-detail-section">
            <h4>Description</h4>

            <p>
              {product.description || "No description available."}
            </p>
          </div>

          {/* CATEGORY DETAILS */}
          <div className="product-detail-grid">
            <div className="product-detail-box">
              <span>Category</span>
              <strong>
                {product?.category?.category || "—"}
              </strong>
            </div>

            <div className="product-detail-box">
              <span>Sub Category</span>
              <strong>
                {product?.subcategory?.subcategory || "—"}
              </strong>
            </div>

            <div className="product-detail-box">
              <span>Seller</span>
              <strong>
                {product?.seller?.name || "—"}
              </strong>
            </div>

            <div className="product-detail-box">
              <span>Seller Email</span>
              <strong>
                {product?.seller?.email || "—"}
              </strong>
            </div>
          </div>

          {/* PRICE DETAILS */}
          <div className="product-detail-section">
            <h4>Price Details</h4>

            <div className="product-detail-grid">
              <div className="product-detail-box">
                <span>Cost Price</span>
                <strong>
                  {formatPrice(product.cost_price)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>MRP</span>
                <strong>
                  {formatPrice(product.mrp)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Selling Price</span>
                <strong>
                  {formatPrice(product.estimated_selling_price)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Final Price</span>
                <strong>
                  {formatPrice(product.final_price)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Shipping Fee</span>
                <strong>
                  {formatPrice(product.shipping_fee)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Platform Fee</span>
                <strong>
                  {formatPrice(product.platform_fee)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Inhand Profit</span>
                <strong>
                  {formatPrice(product.inhand_profit)}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Discount</span>
                <strong>
                  {product.discount || "0%"}
                </strong>
              </div>
            </div>
          </div>

          {/* STOCK & RETURN */}
          <div className="product-detail-section">
            <h4>Stock & Return</h4>

            <div className="product-detail-grid">
              <div className="product-detail-box">
                <span>Total Stock</span>
                <strong>
                  {product.stock ?? 0}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Allow Return</span>
                <strong>
                  {product.allow_return ? "Yes" : "No"}
                </strong>
              </div>

              <div className="product-detail-box">
                <span>Return Window</span>
                <strong>
                  {product.return_window_days
                    ? `${product.return_window_days} Days`
                    : "—"}
                </strong>
              </div>
            </div>
          </div>

          {/* VARIANTS */}
          <div className="product-detail-section">
            <div className="product-section-title-row">
              <h4>Variants</h4>

              <span className="tax-card-count">
                {product.variants?.length || 0}
              </span>
            </div>

            {product.variants?.length > 0 ? (
              <div className="product-variants-wrapper">
                <table className="product-variants-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Color ID</th>
                      <th>Size ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td>{variant.sku || "—"}</td>

                        <td>
                          {formatPrice(variant.price)}
                        </td>

                        <td>
                          {variant.stock ?? 0}
                        </td>

                        <td>
                          {variant.color_id ?? "—"}
                        </td>

                        <td>
                          {variant.size_id ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="product-no-variants">
                No variants available.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}