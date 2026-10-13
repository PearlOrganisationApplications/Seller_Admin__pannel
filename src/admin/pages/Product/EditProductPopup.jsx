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
              ["price", "Price"],
              ["shipping_fee", "Shipping Fee"],
              ["stock", "Stock"],
              [
                "return_window_days",
                "Return Window Days",
              ],
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

            {/* ================= BOOLEAN FIELDS ================= */}
            {[
              ["status", "Active Status"],
              ["is_featured", "Featured"],
              ["is_bestseller", "Bestseller"],
              ["is_new", "New Product"],
              ["is_trending", "Trending"],
              ["allow_return", "Allow Return"],
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


            {/* ================= PRODUCT IMAGES ================= */}
            {imageError && ( <div className="image-error-toast"> {imageError} </div> )}
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