import React, { useEffect, useState } from "react";
import "./BarChart/SubCategory.css";
import { getSubCategories, addSubCategory } from "../api/addCategoryApi";

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }
  const [imagePreview, setImagePreview] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
 
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategory: "",
    description: "",
    status: "active",
    image: null,
  });

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

const fetchSubCategories = async () => {
  setIsLoadingTable(true);

  try {
    const response = await getSubCategories();

    if (response?.success && Array.isArray(response?.data)) {
      setSubCategories(response.data);
    } else {
      setSubCategories([]);
    }
  } catch (error) {
    console.log("Error fetching subcategory:", error);
    setToast({
      type: "error",
      message: "Could not load subcategory.",
    });
  } finally {
    setIsLoadingTable(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      subcategory: "",
      description: "",
      status: "active",
      image: null,
    });
    setImagePreview(null);
    setFormError("");
  };

  const closeModal = () => {
    if (isSubmitting) return; // don't allow closing mid-submit
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.categoryId || !formData.subcategory) {
      setFormError("Category ID and Sub Category Name are required.");
      return;
    }

    // Keys here must exactly match what the backend expects
    // (snake_case category_id, no separate "name" field).
    const payload = new FormData();
    payload.append("category_id", formData.categoryId);
    payload.append("subcategory", formData.subcategory);
    payload.append("description", formData.description);
    payload.append("status", formData.status);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    setIsSubmitting(true);
    try {
      const res = await addSubCategory(payload);

      if (res?.status) {
        // API returns the newly created row in res.data — add it straight
        // to the table instead of refetching the whole list.
        setSubCategories((prev) => [res.data, ...prev]);
        setToast({ type: "success", message: res.message || "Sub category added successfully!" });
        setShowModal(false);
        resetForm();
      } else {
        setFormError(res?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Error adding subcategory:", error);
      setFormError(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subcategory-page">
      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "!"}</span>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="page-header">
       
        <div>
          <h2>Sub Category Management</h2>
          <p className="page-subtitle">Organize your catalog into structured sub categories</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <span className="add-btn-icon">+</span> Add Sub Category
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sub Category Name</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Description</th>
              <th>Total Products</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingTable ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j}>
                      <div className="skeleton-bar" />
                    </td>
                  ))}
                </tr>
              ))
            ) : subCategories && subCategories.length > 0 ? (
              subCategories.map((item, index) => (
                <tr
                  key={item.id}
                  className="table-row-animate"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                 <td>{item.subcategory}</td>
                  <td>{item.slug}</td>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt="subcategory" />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>{item.description}</td>
                <td>{item.products?.length || 0}</td>
                  <td>
                    <span
                      className={`status ${
                        item.status === 1 ? "active" : "inactive"
                      }`}
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
<button
  className="edit-btn"
  onClick={() => {
    setSelectedItem(item);
    setShowEditModal(true);
  }}
>
  Edit
</button>                
    <button className="delete-btn"

  onClick={() => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  }}
>
  Delete
</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  No Subcategories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* GLASSMORPHIC MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="subcategory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3>Add Sub Category</h3>
                <p>Create and structure your store items</p>
              </div>
              <button
                className="close-modal-btn"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Category ID *</label>
                  <input
                    type="text"
                    name="categoryId"
                    placeholder="e.g. CAT-102"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sub Category Name *</label>
                  <input
                    type="text"
                    name="subcategory"
                    placeholder="e.g. Running Shoes"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter a brief description here..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Category Image</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="file-preview-img" />
                    ) : (
                      <>
                        <span className="upload-icon">📁</span>
                        <span>Click to upload or drag image here</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner" /> Saving...
                    </>
                  ) : (
                    "Save Sub Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
  <div
    className="modal-overlay"
    onClick={() => {
      if (!isSubmitting) {
        setShowEditModal(false);
        resetForm();
      }
    }}
  >
    <div
      className="subcategory-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="modal-header">
        <div>
          <h3>Edit Sub Category</h3>
          <p>Update your sub category details</p>
        </div>

        <button
          className="close-modal-btn"
          onClick={() => {
            setShowEditModal(false);
            resetForm();
          }}
          disabled={isSubmitting}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {formError && <div className="form-error">{formError}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Category ID *</label>
            <input
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sub Category Name *</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Category Image</label>

          <div className="file-upload-wrapper">
            <input
              type="file"
              id="edit-file-upload"
              accept="image/*"
              onChange={handleFileChange}
            />

            <label
              htmlFor="edit-file-upload"
              className="file-upload-label"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="file-preview-img"
                />
              ) : (
                <>
                  <span className="upload-icon">📁</span>
                  <span>Click to upload image</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setShowEditModal(false);
              resetForm();
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Updating...
              </>
            ) : (
              "Update Sub Category"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="delete-modal">
      <h3>Delete Sub Category</h3>
      <p>Are you sure you want to delete this sub category?</p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button className="delete-confirm-btn">
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SubCategory;