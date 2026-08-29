import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "././BarChart/AddCategory.css";
import * as CategoryAPI from "../api/addCategoryApi";

function nameToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

const SECTION_META = {
  category: { label: "Category", accent: "cat", icon: "◧" },
  color: { label: "Color", accent: "color", icon: "◑" },
  size: { label: "Size", accent: "size", icon: "◫" },
  spec: { label: "Specification", accent: "spec", icon: "◈" },
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

  const [color, setColors] = useState([]);
  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  const [showInput, setShowInput] = useState({
    category: false,
    color: false,
    size: false,
    spec: false,
  });

  const [inputs, setInputs] = useState({
    category: "",
    color: "",
    size: "",
    spec: "",
  });

  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      const [catRes, colRes, sizRes, specRes] = await Promise.all([
        CategoryAPI.getCategories(),
        CategoryAPI.getColors(),
        CategoryAPI.getSizes(),
        CategoryAPI.getSpecifications(),
      ]);

      setCategory(
        (catRes.data.data || []).map((c) => ({ ...c, id: c.category_id }))
      );
      setColors(colRes.data.colors || []);
      setSizes(sizRes.data.sizes || []);
      setSpecifications(specRes.data.specifications || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async (type) => {
    const value = inputs[type].trim();
    if (!value) return showToast("Enter a valid value.", "error");

    try {
      let res;
      if (type === "color") res = await CategoryAPI.addColor({ colors: [value] });
      if (type === "size") res = await CategoryAPI.addSize({ sizes: [value] });
      if (type === "spec")
        res = await CategoryAPI.addSpecification({ specifications: [value] });

      if (res?.data?.status) {
        setInputs((prev) => ({ ...prev, [type]: "" }));
        setShowInput((prev) => ({ ...prev, [type]: false }));
        showToast("Item added successfully.", "success");
        fetchAll();
      }
    } catch {
      showToast("Failed to add item.", "error");
    }
  };

  const handleDelete = (type, id, e, label) => {
    e.stopPropagation();
    setDeleteConfirm({ type, id, label });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    try {
      if (type === "category") await CategoryAPI.deleteCategory(id);
      if (type === "color") await CategoryAPI.deleteColor(id);
      if (type === "size") await CategoryAPI.deleteSize(id);
      if (type === "spec") await CategoryAPI.deleteSpecification(id);
      showToast("Item deleted successfully.", "success");
      fetchAll();
    } catch {
      showToast("Failed to delete item.", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleUpdate = async () => {
    let value = inputs[editType].trim();
    if (!value) return showToast("Enter a valid value.", "error");

    try {
      let res;
      if (editType === "category")
        res = await CategoryAPI.updateCategory(editId, { category: value });
      if (editType === "color")
        res = await CategoryAPI.updateColor(editId, { color: value });
      if (editType === "size")
        res = await CategoryAPI.updateSize(editId, { size: value });
      if (editType === "spec")
        res = await CategoryAPI.updateSpecification(editId, {
          specification: value,
        });

      if (res?.data?.status) {
        setShowModal(false);
        setEditId(null);
        setInputs({ category: "", color: "", size: "", spec: "" });
        showToast("Updated successfully.", "success");
        fetchAll();
      }
    } catch (error) {
      showToast("Update failed. Please try again.", "error");
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
    formData.append("status", categoryForm.status ? "active" : "inactive");
    if (categoryForm.image) formData.append("image", categoryForm.image);
    if (categoryForm.banner) formData.append("banner", categoryForm.banner);

    try {
      setCategorySubmitting(true);
      const res = await CategoryAPI.addCategory(formData);

      if (res?.status) {
        const created = res.data;

        setCategory((prev) => [
          {
            id: created.category_id,
            category_id: created.category_id,
            category_name: created.category_name,
            slug: created.slug,
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

  const openEditModal = (type, item) => {
    setEditId(item.id);
    setEditType(type);
    setInputs((prev) => ({
      ...prev,
      category: type === "category" ? item.category_name || "" : prev.category,
      color: type === "color" ? item.color || "" : prev.color,
      size: type === "size" ? item.size || "" : prev.size,
      spec: type === "spec" ? item.specification || "" : prev.spec,
    }));
    setShowModal(true);
  };

  const renderSection = (type, items, keyName) => {
    const meta = SECTION_META[type];
    return (
      <section className="tax-card" key={type}>
        <header className="tax-card-head">
          <div className="tax-card-title-group">
            <span className="tax-card-icon">{meta.icon}</span>
            <h3 className="tax-card-title">{meta.label}</h3>
          </div>
          <span className="tax-card-count">{items.length}</span>
        </header>

        <div className="tax-tags-wrapper">
          {items.map((item) => (
            <button
              type="button"
              className="tax-tag-btn"
              key={item.id}
              onClick={() => openEditModal(type, item)}
              title="Click to edit"
            >
              {type === "color" && (
                <span
                  className="tax-color-swatch"
                  style={{
                    background: `hsl(${nameToHue(item[keyName] || "")}, 65%, 55%)`,
                  }}
                />
              )}
              <span>{item[keyName]}</span>
              <span
                className="tax-tag-remove"
                role="button"
                aria-label={`Delete ${item[keyName]}`}
                onClick={(e) => handleDelete(type, item.id, e, item[keyName])}
              >
                ×
              </span>
            </button>
          ))}

          {type === "category" ? (
            <button
              type="button"
              className="tax-tag-btn tax-tag-add-btn"
              onClick={() => setShowAddCategoryModal(true)}
            >
              + Add {meta.label.toLowerCase()}
            </button>
          ) : showInput[type] ? (
            <div className="tax-tag-inline-edit">
              <input
                className="tax-inline-input"
                autoFocus
                placeholder={`New ${meta.label.toLowerCase()}`}
                value={inputs[type]}
                onChange={(e) =>
                  setInputs({ ...inputs, [type]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd(type);
                  if (e.key === "Escape")
                    setShowInput((prev) => ({ ...prev, [type]: false }));
                }}
              />
              <button
                type="button"
                className="tax-inline-btn tax-inline-btn-confirm"
                onClick={() => handleAdd(type)}
              >
                ✓
              </button>
              <button
                type="button"
                className="tax-inline-btn tax-inline-btn-cancel"
                onClick={() => setShowInput((prev) => ({ ...prev, [type]: false }))}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="tax-tag-btn tax-tag-add-btn"
              onClick={() => setShowInput((prev) => ({ ...prev, [type]: true }))}
            >
              + Add {meta.label.toLowerCase()}
            </button>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="tax-page">
      <header className="tax-header">
      
        <div className="tax-header-center">
          <h2>Manage Category</h2>
          <p className="tax-subtitle">
            Add, edit, or remove categories, colors, sizes, and specifications.
          </p>
        </div>
        <button onClick={() => navigate("/admin/dashboard")} className="tax-done-btn">
          Done
        </button>
      </header>

      {loading ? (
        <div className="tax-loading-state">
          <div className="btn-spinner" style={{ borderTopColor: "#7c3aed", width: 28, height: 28 }} />
          <span>Loading taxonomy items…</span>
        </div>
      ) : (
        <div className="tax-grid-layout">
          {renderSection("category", category, "category_name")}
          {renderSection("color", color, "color")}
          {renderSection("size", sizes, "size")}
          {renderSection("spec", specifications, "specification")}
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
        <div className="tax-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tax-glass-modal tax-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="tax-modal-header">
              <div>
                <h3>Edit {SECTION_META[editType]?.label}</h3>
                <p>Update taxonomy value</p>
              </div>
              <button className="tax-modal-close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="tax-modal-body">
              <div className="form-group">
                <label>{SECTION_META[editType]?.label} Name</label>
                <input
                  type="text"
                  autoFocus
                  value={inputs[editType]}
                  onChange={(e) => setInputs({ ...inputs, [editType]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleUpdate}>
                  Save Changes
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