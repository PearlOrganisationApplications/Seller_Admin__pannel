
import React, { useMemo, useState ,useEffect} from "react";
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
} from "lucide-react";
import "./Variants.css";
import AddVariantPopup from "./AddVariantPopup";
import VariantViewPopup from "./VariantViewPopup";
import { getVariants ,addVariant } from "../../api/product";
const Variants = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
const [showAddPopup, setShowAddPopup] = useState(false);
const [addVariantLoading, setAddVariantLoading] = useState(false);
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

  useEffect(() => {
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
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

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

  /*
    Unique Colors
  */
  const colors = useMemo(() => {
    const colorSet = new Set();

    variants.forEach((variant) => {
      if (variant.color?.color) {
        colorSet.add(variant.color.color);
      }
    });

    return Array.from(colorSet);
  }, [variants]);

  /*
    Filter Variants
  */
  const filteredVariants = useMemo(() => {
    return variants.filter((variant) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        variant.sku?.toLowerCase().includes(searchText) ||
        variant.product?.name?.toLowerCase().includes(searchText) ||
        variant.product?.product_uid
          ?.toLowerCase()
          .includes(searchText) ||
        variant.color?.color?.toLowerCase().includes(searchText) ||
        variant.size?.size?.toLowerCase().includes(searchText);

      const matchesProduct =
        productFilter === "all" ||
        String(variant.product_id) === String(productFilter);

      const matchesColor =
        colorFilter === "all" ||
        variant.color?.color === colorFilter;

      return matchesSearch && matchesProduct && matchesColor;
    });
  }, [variants, search, productFilter, colorFilter]);

  /*
    Pagination
  */
  const totalPages = pagination.last_page;
const currentVariants = filteredVariants;

  /*
    Page change
  */
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
  };

  /*
    Reset filters
  */
  const resetFilters = () => {
    setSearch("");
    setProductFilter("all");
    setColorFilter("all");
    setPage(1);
  };

  /*
    Delete dummy variant
  */
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) return;

    setVariants((prev) => prev.filter((item) => item.id !== id));
  };

  /*
    Stock status
  */
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        text: "Out of Stock",
        className: "out-stock",
      };
    }

    if (stock <= 10) {
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

      // Refresh variants
      const refreshed = await getVariants(page);

      if (refreshed?.status && refreshed?.data) {
        setVariants(refreshed.data.data || []);

        setPagination({
          current_page: refreshed.data.current_page || 1,
          last_page: refreshed.data.last_page || 1,
          total: refreshed.data.total || 0,
          per_page: refreshed.data.per_page || 10,
        });
      }
    } else {
      toast.error(response?.message || "Failed to add variant.");
    }
  } catch (error) {
    console.error("Add variant error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Something went wrong while adding variant."
    );
  } finally {
    setAddVariantLoading(false);
  }
};
  return (
    <div className="variants-page">

      {/* ================= HEADER ================= */}

      <div className="variants-header">

        <div>
          <h1>Product Variants</h1>

          <p>
            Manage product variants, colors, sizes, pricing and stock.
          </p>
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

      {/* ================= SUMMARY CARDS ================= */}

      <div className="variant-summary">

        <div className="summary-card">
          <div className="summary-icon">
            <Package />
          </div>

          <div>
            <span>Total Variants</span>
            <strong>{variants.length}</strong>
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
              {variants.filter((item) => item.stock <= 10).length}
            </strong>
          </div>
        </div>

      </div>

      {/* ================= FILTERS ================= */}

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
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* ================= TABLE ================= */}

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

            {currentVariants.length > 0 ? (
              currentVariants.map((variant, index) => {

                const stockStatus = getStockStatus(variant.stock);

                return (
                  <tr key={variant.id}>

                    {/* # */}

                    <td>
                      <span className="row-number">
                        {(page - 1) * perPage + index + 1}
                      </span>
                    </td>

                    {/* PRODUCT */}

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

                          <strong>
                            {variant.product?.name || "N/A"}
                          </strong>

                          <span>
                            {variant.product?.product_uid || "N/A"}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* VARIANT ID */}

                    <td>
                      <span className="variant-id">
                        #{variant.id}
                      </span>
                    </td>

                    {/* COLOR */}

                    <td>

                      {variant.color ? (
                        <div className="attribute-value">

                          <span
                            className="color-dot"
                            style={{
                              backgroundColor:
                                variant.color.color.toLowerCase() ===
                                "white"
                                  ? "#ffffff"
                                  : variant.color.color.toLowerCase(),
                            }}
                          />

                          {variant.color.color}

                        </div>
                      ) : (
                        <span className="not-available">
                          —
                        </span>
                      )}

                    </td>

                    {/* SIZE */}

                    <td>

                      {variant.size ? (
                        <span className="size-badge">
                          {variant.size.size}
                        </span>
                      ) : (
                        <span className="not-available">
                          —
                        </span>
                      )}

                    </td>

                    {/* PRICE */}

                    <td>

                      <strong className="variant-price">
                        ₹{Number(variant.price).toLocaleString("en-IN")}
                      </strong>

                    </td>

                    {/* STOCK */}

                    <td>

                      <div className="stock-wrapper">

                        <strong>
                          {variant.stock}
                        </strong>

                        <span
                          className={`stock-badge ${stockStatus.className}`}
                        >
                          {stockStatus.text}
                        </span>

                      </div>

                    </td>

                    {/* SKU */}

                    <td>
                      <span className="sku">
                        {variant.sku}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>

                      {variant.product?.status ? (
                        <span className="status active-status">
                          Active
                        </span>
                      ) : (
                        <span className="status inactive-status">
                          Inactive
                        </span>
                      )}

                    </td>

                    {/* ACTION */}

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
                          onClick={() =>
                            alert(
                              `Edit Variant #${variant.id}`
                            )
                          }
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() =>
                            handleDelete(variant.id)
                          }
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

                <td
                  colSpan="10"
                  className="empty-state"
                >

                  <Package size={45} />

                  <h3>
                    No variants found
                  </h3>

                  <p>
                    Try changing your search or filters.
                  </p>

                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}

      {filteredVariants.length > 0 && (
        <div className="pagination-wrapper">

          <div className="pagination-info">

            Showing{" "}
            <strong>
              {(page - 1) * perPage + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(
                page * perPage,
                filteredVariants.length
              )}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredVariants.length}
            </strong>{" "}
            variants

          </div>

          <div className="pagination">

            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => changePage(page - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (

              <button
                key={pageNumber}
                className={`pagination-number ${
                  page === pageNumber ? "active" : ""
                }`}
                onClick={() =>
                  changePage(pageNumber)
                }
              >
                {pageNumber}
              </button>

            ))}

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
    colors={variants
      .filter((variant) => variant.color)
      .map((variant) => variant.color)
      .filter(
        (color, index, self) =>
          index === self.findIndex((item) => item.id === color.id)
      )}
    sizes={variants
      .filter((variant) => variant.size)
      .map((variant) => variant.size)
      .filter(
        (size, index, self) =>
          index === self.findIndex((item) => item.id === size.id)
      )}
    loading={addVariantLoading}
    onClose={() => setShowAddPopup(false)}
    onSubmit={handleAddVariant}
  />
)}
    </div>
  );
};

export default Variants;