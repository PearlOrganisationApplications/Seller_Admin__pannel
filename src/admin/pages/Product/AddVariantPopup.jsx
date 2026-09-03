import React, { useState } from "react";
import { X, Upload, Package } from "lucide-react";
import "./AddVariantPopup.css";

const AddVariantPopup = ({
  products = [],
  colors = [],
  sizes = [],
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    product_id: "",
    color_id: "",
    size_id: "",
    price: "",
    stock: "",
    sku: "",
    status: "1",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // ================================
  // INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // IMAGE CHANGE
  // ================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreviewImage(URL.createObjectURL(file));
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product_id) {
      alert("Please select a product.");
      return;
    }

    if (!formData.price) {
      alert("Please enter price.");
      return;
    }

    if (!formData.stock) {
      alert("Please enter stock.");
      return;
    }

    if (!formData.sku) {
      alert("Please enter SKU.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="add-variant-overlay" onClick={onClose}>
      <div
        className="add-variant-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}

        <div className="add-variant-header">
          <div>
            <h2>Add Product Variant</h2>
            <p>Add a new variant for your product.</p>
          </div>

          <button
            type="button"
            className="add-variant-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>
          <div className="add-variant-form">

            {/* PRODUCT */}

            <div className="form-group">
              <label>
                Product <span>*</span>
              </label>

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* COLOR */}

            <div className="form-group">
              <label>Color</label>

              <select
                name="color_id"
                value={formData.color_id}
                onChange={handleChange}
              >
                <option value="">Select Color</option>

                {colors.map((color) => (
                  <option
                    key={color.id || color}
                    value={color.id || color}
                  >
                    {color.color || color}
                  </option>
                ))}
              </select>
            </div>

            {/* SIZE */}

            <div className="form-group">
              <label>Size</label>

              <select
                name="size_id"
                value={formData.size_id}
                onChange={handleChange}
              >
                <option value="">Select Size</option>

                {sizes.map((size) => (
                  <option
                    key={size.id || size}
                    value={size.id || size}
                  >
                    {size.size || size}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label>
                Price <span>*</span>
              </label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* STOCK */}

            <div className="form-group">
              <label>
                Stock <span>*</span>
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* SKU */}

            <div className="form-group">
              <label>
                SKU <span>*</span>
              </label>

              <input
                type="text"
                name="sku"
                placeholder="e.g. TSHIRT-BLK-M-001"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            {/* STATUS */}

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* IMAGE */}

            <div className="form-group full-width">
              <label>Variant Image</label>

              <div className="image-upload-box">

                {previewImage ? (
                  <div className="image-preview-wrapper">
                    <img
                      src={previewImage}
                      alt="Variant Preview"
                      className="variant-image-preview"
                    />

                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={() => {
                        setPreviewImage(null);

                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                        }));
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="variant-image"
                    className="upload-label"
                  >
                    <Upload size={28} />

                    <span>Upload Variant Image</span>

                    <small>
                      JPG, JPEG or PNG
                    </small>
                  </label>
                )}

                <input
                  id="variant-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>
            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="add-variant-footer">

            <button
              type="button"
              className="cancel-variant-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-variant-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Variant"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariantPopup;