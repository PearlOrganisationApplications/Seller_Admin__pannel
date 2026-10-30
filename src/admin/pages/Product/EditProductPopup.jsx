import React, { useState } from "react";
import {
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import "./EditProductPopup.css";

export default function EditProductPopup({
  productForm,
  setProductForm,
  categoryList,
  subcategories,
  fetchSubcategories,
  handleEditProduct,
  editLoading,
  onClose,
}) {
  const [imageError, setImageError] = useState("");
  const estimatedSellingPrice =
    Number(productForm.estimated_selling_price) || 0;
  const shippingFee = Number(productForm.shipping_fee) || 0;
  const mrp = Number(productForm.mrp) || 0;
  const platformFee = (estimatedSellingPrice * 10) / 100;
  const shippingInPrice =
    productForm.show_delivery_charges_to_customer === "no" ? shippingFee : 0;
  const finalSellingPrice =
    estimatedSellingPrice + platformFee + shippingInPrice;
  const discountPercent =
    mrp > 0
      ? Math.max(0, ((mrp - finalSellingPrice) / mrp) * 100)
      : 0;
  const inHandProfit =
    finalSellingPrice - platformFee - shippingInPrice;

  return (
    <div
      className="tax-modal-overlay"
      onClick={onClose}
    >
      <div
        className="tax-glass-modal edit-product-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================= HEADER ================= */}
        <div className="tax-modal-header">
          <div>
            <h3>Edit Product</h3>
            <p>Update product details</p>
          </div>

          <button
            type="button"
            className="tax-modal-close-btn"
            onClick={onClose}
            disabled={editLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="tax-modal-body">

          <div className="edit-product-form-grid">

            {/* ================= CATEGORY ================= */}
            <div className="edit-product-form-group">
              <label>Category</label>

              <select
                value={productForm.category_id}
                onChange={(e) => {
                  const categoryId = e.target.value;

                  setProductForm({
                    ...productForm,
                    category_id: categoryId,
                    subcategory_id: "",
                  });

                  fetchSubcategories(categoryId);
                }}
              >
                <option value="">
                  Select Category
                </option>

                {Array.isArray(categoryList) &&
                  categoryList.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.category}
                    </option>
                  ))}
              </select>
            </div>

            {/* ================= SUBCATEGORY ================= */}
            <div className="edit-product-form-group">
              <label>Subcategory</label>

              <select
                value={productForm.subcategory_id}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    subcategory_id: e.target.value,
                  })
                }
                disabled={!productForm.category_id}
              >
                <option value="">
                  Select Subcategory
                </option>

                {Array.isArray(subcategories) &&
                  subcategories.map((subcategory) => (
                    <option
                      key={subcategory.id}
                      value={subcategory.id}
                    >
                      {subcategory.subcategory}
                    </option>
                  ))}
              </select>
            </div>

            {/* ================= PRODUCT NAME ================= */}
            <div className="edit-product-form-group">
              <label>Product Name</label>

              <input
                type="text"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                  })
                }
                placeholder="Enter product name"
              />
            </div>

            {/* ================= BRAND ================= */}
            <div className="edit-product-form-group">
              <label>Brand</label>

              <input
                type="text"
                value={productForm.brand}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    brand: e.target.value,
                  })
                }
                placeholder="Enter brand"
              />
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div className="edit-product-form-group full-width">
              <label>Description</label>

              <textarea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter product description"
              />
            </div>

            {/* ================= NUMBER FIELDS ================= */}
            {[
              ["cost_price", "Cost Price"],
              ["mrp", "MRP"],
              [
                "estimated_selling_price",
                "Estimated Selling Price",
              ],
              ["shipping_fee", "Shipping Fee"],
              ["stock", "Stock"],
             
            ].map(([key, label]) => (
              <div
                className="edit-product-form-group"
                key={key}
              >
                <label>{label}</label>

                <input
                  type="number"
                  value={productForm[key]}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      [key]: e.target.value,
                    })
                  }
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}

            <div className="edit-product-form-group full-width">
              <label>Show Delivery Charges to Customer?</label>
              <div className="edit-product-delivery-choice">
                <label>
                  <input
                    type="radio"
                    name="show_delivery_charge"
                    value="yes"
                    checked={
                      productForm.show_delivery_charges_to_customer === "yes"
                    }
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        show_delivery_charges_to_customer: e.target.value,
                      })
                    }
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="show_delivery_charge"
                    value="no"
                    checked={
                      productForm.show_delivery_charges_to_customer === "no"
                    }
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        show_delivery_charges_to_customer: e.target.value,
                      })
                    }
                  />
                  No
                </label>
              </div>
              <small>
                If Yes, shipping is shown separately. If No, shipping is
                included in the final price.
              </small>
            </div>

            {[
              ["platform_fee", "Platform Fee (10%)", platformFee],
              ["final_selling_price", "Final Selling Price", finalSellingPrice],
              ["discount_percent", "Discount (%)", discountPercent],
              ["in_hand_profit", "Your In-Hand Profit", inHandProfit],
            ].map(([key, label, value]) => (
              <div
                className={`edit-product-form-group calculated-field ${key === "in_hand_profit" ? "profit-field" : ""
                  } ${key === "final_selling_price" ? "final-price-field" : ""}`}
                key={key}
              >
                <label>{label}</label>

                <input
                  type="number"
                  value={Number(value).toFixed(2)}
                  readOnly
                />
              </div>
            ))}

            {/* ================= BOOLEAN FIELDS ================= */}
            {[
              ["status", "Active Status"],
              ["is_featured", "Featured"],
              ["is_bestseller", "Bestseller"],
              ["is_new", "New Product"],
              ["is_trending", "Trending"],
            ].map(([key, label]) => (
              <div
                className="edit-product-form-group"
                key={key}
              >
                <label>{label}</label>

                <select
                  value={productForm[key]}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      [key]: Number(e.target.value),
                    })
                  }
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
            ))}


            <div className="edit-product-form-group">
              <label>Return Window Days</label>

              <select
                value={Number(productForm.return_window_days ?? 0)}
                onChange={(e) => {
                  const days = Number(e.target.value);

                  setProductForm((prev) => ({
                    ...prev,
                    return_window_days: days,
                    allow_return: days === 0 ? "no" : "yes",
                  }));
                }}
              >
                <option value={0}>0 Days (No Return)</option>
                <option value={3}>Within 3 Days</option>
                <option value={7}>Within 7 Days</option>
              </select>
            </div>


            {/* ================= PRODUCT IMAGES ================= */}
            {imageError && (<div className="image-error-toast"> {imageError} </div>)}
            <div className="edit-product-form-group full-width">

              <label>Product Images</label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"];

                  const invalidFiles = files.filter((file) => {
                    const extension = file.name.split(".").pop().toLowerCase();
                    return !allowedFormats.includes(extension);
                  });

                  if (invalidFiles.length > 0) {
                    setImageError("Only JPG, JPEG, PNG, WEBP, and GIF formats are allowed.");
                    e.target.value = "";
                    return;
                  }

                  setImageError("");
                  setProductForm({
                    ...productForm,
                    images: files,
                  });
                }}

              />

              <small className="edit-product-image-help">
                Select multiple images. Leave empty if you don't want to
                change the existing images.
              </small>

              {productForm.images?.length > 0 && (
                <small>
                  {productForm.images.length} image(s) selected
                </small>
              )}
            </div>



          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="edit-product-form-actions">

            <button
              type="button"
              className="edit-product-cancel-btn"
              onClick={onClose}
              disabled={editLoading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="edit-product-update-btn"
              onClick={handleEditProduct}
              disabled={editLoading}
            >
              {editLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit />
                  Update Product
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}