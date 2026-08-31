import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "././BarChart/AddCategory.css";
import * as CategoryAPI from "../api/addCategoryApi";

const SECTION_META = {
  category: { label: "Category", accent: "cat", icon: "◧" },
};

function firstErrorMessage(data) {
  if (!data) return "";
  const errors = data.errors;
  if (errors && typeof errors === "object") {
    const firstField = Object.keys(errors)[0];
    const firstMsg = errors[firstField]?.[0];
    if (firstMsg) return firstMsg;
  }
  return data.message || "";
}

const EMPTY_CATEGORY_FORM = {
  description: "",
  category: "",
  is_featured: false,
  status: true,
  image: null,
  banner: null,
};

export default function AddCategory() {
  const navigate = useNavigate();

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [category, setCategory] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("category");
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState({ category: "" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
const [editForm, setEditForm] = useState(EMPTY_CATEGORY_FORM);
const [editSubmitting, setEditSubmitting] = useState(false);
const [editError, setEditError] = useState("");
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      const catRes = await CategoryAPI.getCategories();
     setCategory(catRes.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = (id, e, label) => {
    e.stopPropagation();
    setDeleteConfirm({ type: "category", id, label });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id } = deleteConfirm;
    try {
      await CategoryAPI.deleteCategory(id);
      showToast("Item deleted successfully.", "success");
      fetchAll();
    } catch {
      showToast("Failed to delete item.", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

const handleUpdate = async () => {
  setEditError("");
  if (!editForm.category.trim()) {
    setEditError("Category name is required.");
    return;
  }

  const formData = new FormData();
  formData.append("category", editForm.category.trim());
  formData.append("description", editForm.description.trim());
  formData.append("is_featured", editForm.is_featured ? "1" : "0");
  formData.append("status", editForm.status ? "1" : "0");
  if (editForm.image) formData.append("image", editForm.image);
  if (editForm.banner) formData.append("banner", editForm.banner);

  try {
    setEditSubmitting(true);
    const res = await CategoryAPI.updateCategory(editId, formData);

    if (res?.status) {
      setShowModal(false);
      setEditId(null);
      setEditForm(EMPTY_CATEGORY_FORM);
      showToast(res.message || "Updated successfully.", "success");
      fetchAll();
    } else {
      setEditError(firstErrorMessage(res) || "Failed to update category.");
      showToast(firstErrorMessage(res) || "Failed to update category.", "error");
    }
  } catch (err) {
    const msg = firstErrorMessage(err?.response?.data) || "Update failed. Please try again.";
    setEditError(msg);
    showToast(msg, "error");
  } finally {
    setEditSubmitting(false);
  }
};
  const handleCreateCategory = async () => {
    setCategoryError("");

    if (!categoryForm.category.trim()) {
      setCategoryError("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("category", categoryForm.category.trim());
    formData.append("description", categoryForm.description.trim());
    formData.append("is_featured", categoryForm.is_featured ? "1" : "0");
  formData.append("status", categoryForm.status ? "1" : "0");
    if (categoryForm.image) formData.append("image", categoryForm.image);
    if (categoryForm.banner) formData.append("banner", categoryForm.banner);

    try {
      setCategorySubmitting(true);
      const res = await CategoryAPI.addCategory(formData);

      if (res?.status) {
        const created = res.data;

        setCategory((prev) => [
          {
           id: created.id,
  category: created.category_name || created.category,
            category_name: created.category_name,
          
            image: created.image,
            banner: created.banner,
            description: created.description,
            total_products: created.total_products,
            total_subcategories: created.total_subcategories,
            is_featured: created.is_featured,
            status: created.status,
            created_at: created.created_at,
            updated_at: created.updated_at,
          },
          ...prev,
        ]);

        setCategoryForm(EMPTY_CATEGORY_FORM);
        setShowAddCategoryModal(false);
        showToast(res.message || "Category added successfully.", "success");
      } else {
        setCategoryError(firstErrorMessage(res) || "Failed to add category.");
        showToast(firstErrorMessage(res) || "Failed to add category.", "error");
      }
    } catch (err) {
      const msg =
        firstErrorMessage(err?.response?.data) ||
        "Something went wrong. Please try again.";
      setCategoryError(msg);
      showToast(msg, "error");
    } finally {
      setCategorySubmitting(false);
    }
  };

  const closeAddCategoryModal = () => {
    if (categorySubmitting) return;
    setShowAddCategoryModal(false);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setCategoryError("");
  };
const openEditModal = (item) => {
  setEditId(item.id);
  setEditType("category");
  setEditForm({
    category: item.category || "",
    description: item.description || "",
    is_featured: !!item.is_featured,
    status: !!item.status,
    image: null,
    banner: null,
    existingImage: item.image || "",
    existingBanner: item.banner || "",
  });
  setEditError("");
  setShowModal(true);
};

  const renderCategorySection = () => {
    return (
      <section className="tax-card">
        <div className="tax-table-wrapper">
          <table className="tax-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category</th>
              
                <th>Description</th>
                <th>Banner</th>
                {/* <th>Featured</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {category.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image || "/dummy_image.jfif"}
                      alt={item.category}
                      className="tax-table-thumb"
                    />
                  </td>
                  <td className="tax-table-category-name">{item.category}</td>
                 
              <td className="tax-table-desc" title={item.description || ""}>
  {item.description
    ? item.description.split(" ").slice(0, 6).join(" ") + (item.description.split(" ").length > 6 ? "..." : "")
    : "—"}
</td>
                  <td>
                    <img
                      src={item.banner || "/dummy_image.jfif"}
                      alt={`${item.category} banner`}
                      className="tax-table-thumb"
                    />
                  </td>
                  {/* <td>
                    {item.is_featured && (
                      <span className="tax-featured-badge">★ Featured</span>
                    )}
                  </td> */}
                  <td>
                    <span className={`tax-status-badge ${item.status ? "active" : "inactive"}`}>
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="tax-table-actions">
                      <button type="button" className="tax-table-edit-btn" onClick={() => openEditModal(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="tax-table-delete-btn"
                        onClick={(e) => handleDelete(item.id, e, item.category)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="tax-page">
      <header className="tax-header">
        <div className="tax-header-center">
          <h2>Manage Category</h2>
          <p className="tax-subtitle">Add, edit, or remove categories.</p>
        </div>
        <div className="tax-header-actions">
          <button
            type="button"
            className="tax-header-add-btn"
            onClick={() => setShowAddCategoryModal(true)}
          >
            + Add Category
          </button>
          {/* <button onClick={() => navigate("/admin/dashboard")} className="tax-done-btn">
            Done
          </button> */}
        </div>
      </header>

      {loading ? (
        <div className="tax-loading-state">
          <div className="btn-spinner" style={{ borderTopColor: "#7c3aed", width: 28, height: 28 }} />
          <span>Loading category items…</span>
        </div>
      ) : (
        <div className="tax-grid-layout">
          {renderCategorySection()}
        </div>
      )}

      {showAddCategoryModal && (
        <div className="tax-modal-overlay" onClick={closeAddCategoryModal}>
          <div className="tax-glass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tax-modal-header">
              <div>
                <h3>Add Category</h3>
                <p>Create a new product category for your catalog</p>
              </div>
              <button
                className="tax-modal-close-btn"
                onClick={closeAddCategoryModal}
                disabled={categorySubmitting}
              >
                ×
              </button>
            </div>

            <div className="tax-modal-body">
              {categoryError && <div className="form-error">{categoryError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Electronics"
                    value={categoryForm.category}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, category: e.target.value })
                    }
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={categoryForm.status ? "true" : "false"}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        status: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter category description..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Featured Category</label>
                <select
                  value={categoryForm.is_featured ? "true" : "false"}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      is_featured: e.target.value === "true",
                    })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category Image</label>
                  <div className="file-upload-wrapper">
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            image: e.target.files[0] || null,
                          })
                        }
                      />
                      {categoryForm.image ? (
                        <img
                          src={URL.createObjectURL(categoryForm.image)}
                          alt="Preview"
                          className="file-preview-img"
                        />
                      ) : (
                        <>
                          <span className="upload-icon">🖼️</span>
                          <span>Choose Image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Banner Image</label>
                  <div className="file-upload-wrapper">
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            banner: e.target.files[0] || null,
                          })
                        }
                      />
                      {categoryForm.banner ? (
                        <img
                          src={URL.createObjectURL(categoryForm.banner)}
                          alt="Preview"
                          className="file-preview-img"
                        />
                      ) : (
                        <>
                          <span className="upload-icon">🖼️</span>
                          <span>Choose Banner</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeAddCategoryModal}
                  disabled={categorySubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleCreateCategory}
                  disabled={categorySubmitting}
                >
                  {categorySubmitting ? (
                    <>
                      <div className="btn-spinner" />
                      Creating…
                    </>
                  ) : (
                    "+ Create Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     {showModal && (
  <div className="tax-modal-overlay" onClick={() => !editSubmitting && setShowModal(false)}>
    <div className="tax-glass-modal" onClick={(e) => e.stopPropagation()}>
      <div className="tax-modal-header">
        <div>
          <h3>Edit Category</h3>
          <p>Update category value</p>
        </div>
        <button className="tax-modal-close-btn" onClick={() => setShowModal(false)} disabled={editSubmitting}>
          ×
        </button>
      </div>
      <div className="tax-modal-body">
        {editError && <div className="form-error">{editError}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              autoFocus
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={editForm.status ? "true" : "false"}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value === "true" })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Featured Category</label>
          <select
            value={editForm.is_featured ? "true" : "false"}
            onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.value === "true" })}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category Image</label>
            <div className="file-upload-wrapper">
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] || null })}
                />
                {editForm.image ? (
                  <img src={URL.createObjectURL(editForm.image)} alt="Preview" className="file-preview-img" />
                ) : editForm.existingImage ? (
                  <img src={editForm.existingImage} alt="Current" className="file-preview-img" />
                ) : (
                  <>
                    <span className="upload-icon">🖼️</span>
                    <span>Choose Image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Banner Image</label>
            <div className="file-upload-wrapper">
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, banner: e.target.files[0] || null })}
                />
                {editForm.banner ? (
                  <img src={URL.createObjectURL(editForm.banner)} alt="Preview" className="file-preview-img" />
                ) : editForm.existingBanner ? (
                  <img src={editForm.existingBanner} alt="Current" className="file-preview-img" />
                ) : (
                  <>
                    <span className="upload-icon">🖼️</span>
                    <span>Choose Banner</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={() => setShowModal(false)} disabled={editSubmitting}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleUpdate} disabled={editSubmitting}>
            {editSubmitting ? (
              <>
                <div className="btn-spinner" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {deleteConfirm && (
        <div className="tax-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="tax-glass-modal tax-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="tax-modal-header" style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
              <div>
                <h3>Confirm Delete</h3>
                <p>Action cannot be undone</p>
              </div>
              <button className="tax-modal-close-btn" onClick={() => setDeleteConfirm(null)}>
                ×
              </button>
            </div>
            <div className="tax-modal-body">
              <p style={{ margin: "10px 0 20px", color: "#1e293b", fontSize: "14px" }}>
                Are you sure you want to delete "<strong>{deleteConfirm.label}</strong>"?
              </p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="tax-danger-btn" onClick={confirmDelete}>
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-icon">{toast.type === "success" ? "✓" : "!"}</div>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}