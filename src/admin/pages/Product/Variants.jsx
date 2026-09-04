import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Palette,
  Ruler,
  Edit,
  Trash2,
  Eye,
  Plus,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import "./Variants.css";
import AddVariantPopup from "./AddVariantPopup";
import VariantViewPopup from "./VariantViewPopup";
import {
  getVariants,
  addVariant,
  updateVariant,
  deleteVariant,
} from "../../api/product";

const Variants = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteVariantId, setDeleteVariantId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [addVariantLoading, setAddVariantLoading] = useState(false);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editVariantLoading, setEditVariantLoading] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const perPage = pagination.per_page || 10;

  const fetchVariants = async () => {
    try {
      setLoading(true);

      const response = await getVariants(page);

      if (response?.status && response?.data) {
        setVariants(response.data.data || []);

        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          total: response.data.total || 0,
          per_page: response.data.per_page || 10,
        });
      } else {
        setVariants([]);
      }
    } catch (error) {
      console.error("Failed to fetch variants:", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch variants.",
      );

      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [page]);

  const products = useMemo(() => {
    const map = new Map();

    variants.forEach((variant) => {
      if (variant.product) {
        map.set(variant.product.id, variant.product);
      }
    });

    return Array.from(map.values());
  }, [variants]);

  const colors = useMemo(() => {
    const map = new Map();

    variants.forEach((variant) => {
      if (variant.color) {
        map.set(variant.color.id, variant.color);
      }
    });

    return Array.from(map.values());
  }, [variants]);

  const sizes = useMemo(() => {
    const map = new Map();

    variants.forEach((variant) => {
      if (variant.size) {
        map.set(variant.size.id, variant.size);
      }
    });

    return Array.from(map.values());
  }, [variants]);

  const filteredVariants = useMemo(() => {
    return variants.filter((variant) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        variant.sku?.toLowerCase().includes(searchText) ||
        variant.product?.name?.toLowerCase().includes(searchText) ||
        variant.product?.product_uid?.toLowerCase().includes(searchText) ||
        variant.color?.color?.toLowerCase().includes(searchText) ||
        variant.size?.size?.toLowerCase().includes(searchText);

      const matchesProduct =
        productFilter === "all" ||
        String(variant.product_id) === String(productFilter);

      const matchesColor =
        colorFilter === "all" ||
        String(variant.color?.id) === String(colorFilter);

      return matchesSearch && matchesProduct && matchesColor;
    });
  }, [variants, search, productFilter, colorFilter]);

  const totalPages = pagination.last_page;

  const currentVariants = filteredVariants;

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setProductFilter("all");
    setColorFilter("all");
    setPage(1);
  };

  const getStockStatus = (stock) => {
    if (Number(stock) === 0) {
      return {
        text: "Out of Stock",
        className: "out-stock",
      };
    }

    if (Number(stock) <= 10) {
      return {
        text: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      text: "In Stock",
      className: "in-stock",
    };
  };

  const handleAddVariant = async (formData) => {
    try {
      setAddVariantLoading(true);

      const response = await addVariant(formData);

      if (response?.status) {
        toast.success("Variant added successfully!");

        setShowAddPopup(false);

        await fetchVariants();
      } else {
        toast.error(response?.message || "Failed to add variant.");
      }
    } catch (error) {
      console.error("Add variant error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while adding variant.",
      );
    } finally {
      setAddVariantLoading(false);
    }
  };

  const handleEdit = (variant) => {
    setEditVariant({
      id: variant.id,
      product_id: variant.product_id || "",
      color_id: variant.color_id || variant.color?.id || "",
      size_id: variant.size_id || variant.size?.id || "",
      price: variant.price || "",
      stock: variant.stock ?? "",
      sku: variant.sku || "",
      status:
        variant.status !== undefined
          ? Boolean(variant.status)
          : Boolean(variant.product?.status),
      image: null,
      currentImage: variant.image || "",
    });

    setShowEditPopup(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      setEditVariant((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));

      return;
    }

    setEditVariant((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateVariant = async (e) => {
    e.preventDefault();

    if (!editVariant) return;

    try {
      setEditVariantLoading(true);

      const formData = new FormData();

      formData.append("product_id", editVariant.product_id);
      formData.append("color_id", editVariant.color_id || "");
      formData.append("size_id", editVariant.size_id || "");
      formData.append("price", editVariant.price);
      formData.append("stock", editVariant.stock);
      formData.append("sku", editVariant.sku);
      formData.append("status", editVariant.status ? "1" : "0");

      if (editVariant.image) {
        formData.append("image", editVariant.image);
      }

      const response = await updateVariant(editVariant.id, formData);

      if (response?.status) {
        toast.success(response?.message || "Variant updated successfully!");

        setShowEditPopup(false);
        setEditVariant(null);

        await fetchVariants();
      } else {
        toast.error(response?.message || "Failed to update variant.");
      }
    } catch (error) {
      console.error("Update variant error:", error);

      const validationErrors = error?.response?.data?.errors;

      if (validationErrors) {
        Object.values(validationErrors)
          .flat()
          .forEach((message) => {
            toast.error(message);
          });
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong while updating variant.",
        );
      }
    } finally {
      setEditVariantLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteVariantId(id);
    setShowDeletePopup(true);
  };

  const confirmDeleteVariant = async () => {
    if (!deleteVariantId) return;

    try {
      setDeleteLoading(true);

      await deleteVariant(deleteVariantId);

      toast.success("Variant deleted successfully");

      setShowDeletePopup(false);
      setDeleteVariantId(null);

      if (variants.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchVariants();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete variant");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="variants-page">
      <div className="variants-header">
        <div>
          <h1>Product Variants</h1>

          <p>Manage product variants, colors, sizes, pricing and stock.</p>
        </div>

        <button
          className="add-variant-btn"
          onClick={() => setShowAddPopup(true)}
          title="Add Variant"
        >
          <Plus size={17} />
          Add Variant
        </button>
      </div>

      <div className="variant-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Package />
          </div>

          <div>
            <span>Total Variants</span>
            <strong>{pagination.total || variants.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Palette />
          </div>

          <div>
            <span>Total Colors</span>
            <strong>{colors.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Ruler />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Package />
          </div>

          <div>
            <span>Low Stock</span>

            <strong>
              {variants.filter((item) => Number(item.stock) <= 10).length}
            </strong>
          </div>
        </div>
      </div>

      <div className="variant-filters">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search SKU, product, color or size..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-box">
          <Filter size={17} />

          <select
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Products</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <Palette size={17} />

          <select
            value={colorFilter}
            onChange={(e) => {
              setColorFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Colors</option>

            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.color}
              </option>
            ))}
          </select>
        </div>

        {(search || productFilter !== "all" || colorFilter !== "all") && (
          <button className="reset-filter-btn" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>

      <div className="variants-table-wrapper">
        <table className="variants-table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Product</th>
              <th>Variant</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Stock</th>
              <th>SKU</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="empty-state">
                  <Loader2 size={40} className="animate-spin" />

                  <h3>Loading variants...</h3>
                </td>
              </tr>
            ) : currentVariants.length > 0 ? (
              currentVariants.map((variant, index) => {
                const stockStatus = getStockStatus(variant.stock);

                return (
                  <tr key={variant.id}>
                    <td>
                      <span className="row-number">
                        {(page - 1) * perPage + index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="product-info">
                        <img
                          src={
                            variant.product?.image ||
                            "https://placehold.co/80x80/png?text=Product"
                          }
                          alt={variant.product?.name || "Product"}
                          className="product-image"
                        />

                        <div className="product-details">
                          <strong>{variant.product?.name || "N/A"}</strong>

                          <span>{variant.product?.product_uid || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="variant-id">#{variant.id}</span>
                    </td>

                    <td>
                      {variant.color ? (
                        <div className="attribute-value">
                          <span
                            className="color-dot"
                            style={{
                              backgroundColor:
                                variant.color.color?.toLowerCase() === "white"
                                  ? "#ffffff"
                                  : variant.color.color?.toLowerCase(),
                            }}
                          />

                          {variant.color.color}
                        </div>
                      ) : (
                        <span className="not-available">—</span>
                      )}
                    </td>

                    <td>
                      {variant.size ? (
                        <span className="size-badge">{variant.size.size}</span>
                      ) : (
                        <span className="not-available">—</span>
                      )}
                    </td>

                    <td>
                      <strong className="variant-price">
                        ₹{Number(variant.price).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <div className="stock-wrapper">
                        <strong>{variant.stock}</strong>

                        <span
                          className={`stock-badge ${stockStatus.className}`}
                        >
                          {stockStatus.text}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="sku">{variant.sku}</span>
                    </td>

                    <td>
                      {variant.status ? (
                        <span className="status active-status">Active</span>
                      ) : (
                        <span className="status inactive-status">Inactive</span>
                      )}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          title="View"
                          onClick={() => {
                            setSelectedVariant(variant);
                            setShowViewPopup(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="action-btn edit-btn"
                          title="Edit"
                          onClick={() => handleEdit(variant)}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(variant.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="empty-state">
                  <Package size={45} />

                  <h3>No variants found</h3>

                  <p>Try changing your search or filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredVariants.length > 0 && (
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing <strong>{(page - 1) * perPage + 1}</strong> to{" "}
            <strong>{Math.min(page * perPage, pagination.total)}</strong> of{" "}
            <strong>{pagination.total}</strong> variants
          </div>

          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => changePage(page - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`pagination-number ${
                    page === pageNumber ? "active" : ""
                  }`}
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => changePage(page + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {showViewPopup && selectedVariant && (
        <VariantViewPopup
          variant={selectedVariant}
          onClose={() => {
            setShowViewPopup(false);
            setSelectedVariant(null);
          }}
        />
      )}

      {showAddPopup && (
        <AddVariantPopup
          products={products}
          colors={colors}
          sizes={sizes}
          loading={addVariantLoading}
          onClose={() => setShowAddPopup(false)}
          onSubmit={handleAddVariant}
        />
      )}

      {showEditPopup && editVariant && (
        <div className="variant-modal-overlay">
          <div className="variant-edit-modal">
            <div className="variant-modal-header">
              <div>
                <h2>Edit Variant</h2>

                <p>Update variant information and stock.</p>
              </div>

              <button
                type="button"
                className="variant-modal-close"
                onClick={() => {
                  if (!editVariantLoading) {
                    setShowEditPopup(false);
                    setEditVariant(null);
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateVariant} className="variant-edit-form">
              <div className="variant-form-grid">
                <div className="variant-form-group">
                  <label>Product</label>

                  <select
                    name="product_id"
                    value={editVariant.product_id}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">Select Product</option>

                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="variant-form-group">
                  <label>Color</label>

                  <select
                    name="color_id"
                    value={editVariant.color_id}
                    onChange={handleEditInputChange}
                  >
                    <option value="">Select Color</option>

                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="variant-form-group">
                  <label>Size</label>

                  <select
                    name="size_id"
                    value={editVariant.size_id}
                    onChange={handleEditInputChange}
                  >
                    <option value="">Select Size</option>

                    {sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="variant-form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="price"
                    value={editVariant.price}
                    onChange={handleEditInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="variant-form-group">
                  <label>Stock</label>

                  <input
                    type="number"
                    name="stock"
                    value={editVariant.stock}
                    onChange={handleEditInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="variant-form-group">
                  <label>SKU</label>

                  <input
                    type="text"
                    name="sku"
                    value={editVariant.sku}
                    onChange={handleEditInputChange}
                    maxLength="255"
                    required
                  />
                </div>

                <div className="variant-form-group full-width">
                  <label>Variant Image</label>

                  <div className="variant-image-upload">
                    {editVariant.image ? (
                      <div className="selected-image-name">
                        <Upload size={16} />
                        <span>{editVariant.image.name}</span>
                      </div>
                    ) : editVariant.currentImage ? (
                      <div className="current-variant-image">
                        <img
                          src={editVariant.currentImage}
                          alt="Current variant"
                        />

                        <span>Current image</span>
                      </div>
                    ) : (
                      <span>No image selected</span>
                    )}

                    <label className="upload-image-btn">
                      <Upload size={16} />
                      Choose Image
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleEditInputChange}
                        hidden
                      />
                    </label>
                  </div>
                </div>

                <div className="variant-form-group status-form-group">
                  <label className="status-checkbox-label">
                    <input
                      type="checkbox"
                      name="status"
                      checked={editVariant.status}
                      onChange={handleEditInputChange}
                    />

                    <span>Active Variant</span>
                  </label>
                </div>
              </div>

              <div className="variant-modal-footer">
                <button
                  type="button"
                  className="variant-cancel-btn"
                  disabled={editVariantLoading}
                  onClick={() => {
                    setShowEditPopup(false);
                    setEditVariant(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="variant-save-btn"
                  disabled={editVariantLoading}
                >
                  {editVariantLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit size={17} />
                      Update Variant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <Trash2 size={26} />
            </div>

            <div className="delete-modal-content">
              <h3>Delete Variant?</h3>
              <p>
                Are you sure you want to delete this variant? This action cannot
                be undone.
              </p>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteVariantId(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDeleteVariant}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="delete-spinner" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variants;
