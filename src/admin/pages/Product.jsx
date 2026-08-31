

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCategories, getSubCategoriesByCategory } from "../api/addCategoryApi";
import {
  FaSearch,
  FaEye,
  FaBoxOpen,
  FaStore,
  FaTag,
  FaLayerGroup,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaFire,
  FaPlus,
} from "react-icons/fa";

import "./BarChart/Product.css";
import { toast } from "react-toastify";
import { getProducts ,addProduct } from "../api/product";



function CustomDropdown({ value, options, onChange, placeholder = "All" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="custom-dropdown" ref={ref}>
      <button
        type="button"
        className="custom-dropdown-toggle"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder}
        <span className={`custom-dropdown-arrow ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <ul className="custom-dropdown-menu">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`custom-dropdown-item ${
                opt.value === value ? "active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(20);
const [showAddProduct, setShowAddProduct] = useState(false);
const [categoryList, setCategoryList] = useState([]);
const [subcategories, setSubcategories] = useState([]);
const [productForm, setProductForm] = useState({
category_id: "",
subcategory_id: "",
  name: "",
  brand: "",
  description: "",
  cost_price: "",
  mrp:"" ,
  estimated_selling_price:"",
  price: "",
  shipping_fee: "",
  stock: "",
  status: "",
  is_featured: "",
  is_bestseller: "",
  is_new: "",
  is_trending: "",
  allow_return: "",
  return_window_days: "",
  image: null,
});

const fetchCategories = async () => {
  try {
    const response = await getCategories();

    console.log("Category API Response:", response);

    if (response?.status) {
      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      setCategoryList(data);
    }
  } catch (error) {
    console.error("Category API Error:", error);
    setCategoryList([]);
  }
};

const fetchSubcategories = async (categoryId) => {
  if (!categoryId) {
    setSubcategories([]);
    return;
  }

  try {
    const response = await getSubCategoriesByCategory(categoryId);

    console.log("Subcategory API Response:", response);

   if (response?.status && Array.isArray(response?.data)) {
  setSubcategories(response.data);
} else {
  setSubcategories([]);
}
  } catch (error) {
    console.error("Subcategory API Error:", error);
    setSubcategories([]);
  }
};
 const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);
    setError("");

    const response = await getProducts(page);

    console.log("Products API Response:", response);

    if (response?.status) {
      const productData = response?.data;

      setProducts(productData?.data || []);
      setCurrentPage(productData?.current_page || 1);
      setLastPage(productData?.last_page || 1);
      setTotalProducts(productData?.total || 0);
      setPerPage(productData?.per_page || 20);
    } else {
      setProducts([]);
      setError(
        response?.message || "Failed to fetch products."
      );
    }
  } catch (err) {
    console.error("Products API Error:", err);

    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while fetching products."
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchProducts(1);
  fetchCategories();
}, []);

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product?.category?.category)
      .filter(Boolean);

    return [...new Set(uniqueCategories)];
  }, [products]);

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        product?.name?.toLowerCase().includes(searchValue) ||
        product?.product_uid?.toLowerCase().includes(searchValue) ||
        product?.slug?.toLowerCase().includes(searchValue) ||
        product?.seller?.name?.toLowerCase().includes(searchValue) ||
        product?.category?.category
          ?.toLowerCase()
          .includes(searchValue) ||
        product?.subcategory?.subcategory
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product?.status === true) ||
        (statusFilter === "inactive" && product?.status === false);

      const matchesCategory =
        categoryFilter === "all" ||
        product?.category?.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [products, search, statusFilter, categoryFilter]);

  /* ================= DESCRIPTION ================= */

  const shortDescription = (description) => {
    if (!description) return "—";

    const words = description.trim().split(/\s+/);

    return (
      words.slice(0, 6).join(" ") +
      (words.length > 6 ? "..." : "")
    );
  };

  /* ================= PRICE ================= */

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "₹0";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  /* ================= STOCK ================= */

  const getStockClass = (stock) => {
    if (stock === 0) return "product-stock-out";
    if (stock <= 10) return "product-stock-low";

    return "product-stock-good";
  };

  const getStockText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";

    return "In Stock";
  };

  /* ================= PAGE CHANGE ================= */

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return;
    }

    setCurrentPage(page);
    fetchProducts(page);
  };

const handleAddProduct = async () => {
  try {
    const formData = new FormData();

    Object.keys(productForm).forEach((key) => {
      if (productForm[key] !== null && productForm[key] !== "") {
        formData.append(key, productForm[key]);
      }
    });

    const response = await addProduct(formData);

    console.log("Add Product API Response:", response);

    if (response?.status || response?.success) {
      toast.success(response?.message || "Product added successfully!");

      setShowAddProduct(false);

      setProductForm({
        category_id: "",
        subcategory_id: "",
        name: "",
        brand: "",
        description: "",
        cost_price: "",
        mrp: "",
        estimated_selling_price: "",
        price: "",
        shipping_fee: "",
        stock: "",
        status: "",
        is_featured: "",
        is_bestseller: "",
        is_new: "",
        is_trending: "",
        allow_return: "",
        return_window_days: "",
        image: null,
      });

      setSubcategories([]);

      fetchProducts(currentPage);
    } else {
      toast.error(response?.message || "Failed to add product.");
    }
  } catch (error) {
    console.error("Add Product Error:", error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while adding product."
    );
  }
};
  /* ================= RESET FILTERS ================= */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  /* ================= PRODUCT DETAILS ================= */

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  /* ================= PAGINATION ================= */

  const paginationNumbers = useMemo(() => {
    const pages = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= lastPage - 2) {
        pages.push(
          lastPage - 4,
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage
        );
      } else {
        pages.push(
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2
        );
      }
    }

    return pages;
  }, [currentPage, lastPage]);

  /* ================= RENDER ================= */

  return (
    <div className="tax-page product-page">

      {/* ================= HEADER ================= */}

      <header className="tax-header">

        <div className="tax-header-center">
          <h2>Product Management</h2>

          <p className="tax-subtitle">
            Manage and monitor all products in your catalog.
          </p>
        </div>

        <div className="tax-header-actions">

       <button
  type="button"
  className="add-product-btn"
  onClick={() => setShowAddProduct(true)}
>
  <FaPlus />
  <span>Add Product</span>
</button>
        </div>

      </header>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="product-summary-grid">

        <div className="product-summary-card">

          <div className="product-summary-icon purple">
            <FaBoxOpen />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>

        </div>

        <div className="product-summary-card">

          <div className="product-summary-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>Active Products</span>
            <strong>
              {
                products.filter(
                  (item) => item?.status === true
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="product-summary-card">

          <div className="product-summary-icon orange">
            <FaTag />
          </div>

          <div>
            <span>Featured</span>
            <strong>
              {
                products.filter(
                  (item) => item?.is_featured === true
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="product-summary-card">

          <div className="product-summary-icon blue">
            <FaStore />
          </div>

          <div>
            <span>Sellers</span>
            <strong>
              {
                new Set(
                  products
                    .map((item) => item?.seller?.id)
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>

        </div>

      </div>

      {/* ================= FILTER CARD ================= */}

      <section className="tax-card product-filter-card">

        <div className="product-filter-row">

          {/* SEARCH */}

          <div className="product-search-wrapper">

            <FaSearch className="product-search-icon" />

            <input
              type="text"
              placeholder="Search product, UID, seller, category..."
              value={search}

            onChange={(e) => {
  const categoryId = e.target.value;

  setProductForm({
    ...productForm,
    category_id: categoryId,
    subcategory_id: "",
  });
}}

              className="product-search-input"
            />

            {search && (
              <button
                className="product-search-clear"
                onClick={() => setSearch("")}
              >
                <FaTimes />
              </button>
            )}

          </div>

          {/* STATUS */}

        {/* ✅ iski jagah yeh daal do */}
<CustomDropdown
  value={statusFilter}
  onChange={(val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }}
  options={[
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]}
/>
          {/* CATEGORY */}

        <CustomDropdown
  value={categoryFilter}
  onChange={(val) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  }}
  options={[
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ]}
/>

          {/* RESET */}

          {(search ||
            statusFilter !== "all" ||
            categoryFilter !== "all") && (
            <button
              className="product-reset-btn"
              onClick={resetFilters}
            >
              Reset
            </button>
          )}

        </div>

      </section>

      {/* ================= PRODUCT TABLE ================= */}

      <section className="tax-card product-table-card">

        <div className="product-table-heading">

          <div>

            <div className="tax-card-title-group">

              <FaBoxOpen className="tax-card-icon" />

              <h3 className="tax-card-title">
                Products
              </h3>

            </div>

            <p className="product-result-text">
              Showing {filteredProducts.length} products
            </p>

          </div>

        </div>

        {loading ? (

          /* ================= LOADING ================= */

          <div className="tax-loading-state">

            <div
              className="btn-spinner"
              style={{
                borderTopColor: "#7c3aed",
                width: 28,
                height: 28,
              }}
            />

            <span>
              Loading products...
            </span>

          </div>

        ) : error ? (

          /* ================= ERROR ================= */

          <div className="product-error-state">

            <FaTimesCircle />

            <p>{error}</p>

            <button
              className="product-retry-btn"
              onClick={() =>
                fetchProducts(currentPage)
              }
            >
              Try Again
            </button>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="product-empty-state">

            <FaBoxOpen />

            <h3>
              No Products Found
            </h3>

            <p>
              No products match your current filters.
            </p>

          </div>

        ) : (

          /* ================= TABLE ================= */

          <div className="tax-table-wrapper">

            <table className="tax-table product-table">

              <thead>

                <tr>

                  <th>Product</th>

                  <th>Category</th>

                  <th>Sub Category</th>

                  <th>Seller</th>

                  <th>Price</th>

              

                  <th>Discount</th>

                  

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map((product) => (

                  <tr key={product.id}>

                    {/* PRODUCT */}

                    <td>

                      <div className="product-info-cell">

                        <img
                          src={
                            product.image ||
                            DUMMY_IMAGE
                          }
                          alt={product.name}
                          className="product-table-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              DUMMY_IMAGE;
                          }}
                        />

                        <div className="product-name-wrapper">

                          <strong
                            className="product-name"
                            title={product.name}
                          >
                            {product.name || "—"}
                          </strong>

                          <span className="product-uid">
                            {product.product_uid || "—"}
                          </span>

                          <span
                            className="product-description"
                            title={
                              product.description || ""
                            }
                          >
                            {shortDescription(
                              product.description
                            )}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td>

                      <div className="product-category-cell">

                        <span className="product-category-name">
                          {product?.category?.category ||
                            "—"}
                        </span>

                       

                      </div>

                    </td>

                    {/* SUB CATEGORY */}

                    <td>

                      <div className="product-subcategory-cell">

                        <span>
                          {product?.subcategory
                            ?.subcategory || "—"}
                        </span>

                       

                      </div>

                    </td>

                    {/* SELLER */}

                    <td>

                      <div className="product-seller-cell">

                        <div className="product-seller-avatar">
                          <FaStore />
                        </div>

                        <div>

                          <strong>
                            {product?.seller?.name ||
                              "—"}
                          </strong>

                          <small>
                            {product?.seller?.email ||
                              "—"}
                          </small>

                        </div>

                      </div>

                    </td>

                    {/* PRICE */}

                    <td>

                      <div className="product-price-cell">

                        <strong>
                          {formatPrice(
                            product.final_price
                          )}
                        </strong>

                        <del>
                          {formatPrice(product.mrp)}
                        </del>

                        <small>
                          Selling:{" "}
                          {formatPrice(
                            product.estimated_selling_price
                          )}
                        </small>

                      </div>

                    </td>

                    
                    {/* DISCOUNT */}

                    <td>

                      <span className="product-discount-badge">
                        {product.discount || "0%"}
                      </span>

                    </td>

                   

                    {/* STATUS */}

                    <td>

                      <span
                        className={`tax-status-badge ${
                          product.status
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {product.status ? (
                          <>
                            <FaCheckCircle />
                            Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle />
                            Inactive
                          </>
                        )}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className="product-view-btn"
                        onClick={() =>
                          openProductDetails(product)
                        }
                        title="View Product"
                      >
                        <FaEye />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* ================= PAGINATION ================= */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="product-pagination">

              <div className="product-pagination-info">

                Showing{" "}
                <strong>
                  {(currentPage - 1) * perPage + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(
                    currentPage * perPage,
                    totalProducts
                  )}
                </strong>{" "}
                of{" "}
                <strong>{totalProducts}</strong>

              </div>

              <div className="product-pagination-controls">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  className="product-page-arrow"
                >
                  <FaChevronLeft />
                </button>

                {paginationNumbers.map((page) => (

                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      handlePageChange(page)
                    }
                    className={`product-page-number ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                  >
                    {page}
                  </button>

                ))}

                <button
                  type="button"
                  disabled={
                    currentPage === lastPage
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  className="product-page-arrow"
                >
                  <FaChevronRight />
                </button>

              </div>

            </div>
          )}

      </section>

      {/* ================= PRODUCT DETAILS MODAL ================= */}

      {selectedProduct && (

        <div
          className="tax-modal-overlay"
          onClick={closeProductDetails}
        >

          <div
            className="tax-glass-modal product-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="tax-modal-header">

              <div>

                <h3>
                  Product Details
                </h3>

                <p>
                  {selectedProduct.product_uid}
                </p>

              </div>

              <button
                className="tax-modal-close-btn"
                onClick={closeProductDetails}
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="tax-modal-body">

              {/* TOP */}

              <div className="product-modal-top">

                <img
                  src={
                    selectedProduct.image ||
                    DUMMY_IMAGE
                  }
                  alt={selectedProduct.name}
                  className="product-modal-image"
                  onError={(e) => {
                    e.currentTarget.src =
                      DUMMY_IMAGE;
                  }}
                />

                <div className="product-modal-main">

                  <h2>
                    {selectedProduct.name}
                  </h2>

                  <p>
                    {selectedProduct.slug}
                  </p>

                  <div className="product-modal-badges">

                    <span
                      className={`tax-status-badge ${
                        selectedProduct.status
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {selectedProduct.status
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {selectedProduct.is_featured && (
                      <span className="product-mini-tag featured">
                        <FaStar />
                        Featured
                      </span>
                    )}

                    {selectedProduct.is_bestseller && (
                      <span className="product-mini-tag bestseller">
                        Bestseller
                      </span>
                    )}

                    {selectedProduct.is_new && (
                      <span className="product-mini-tag new">
                        New
                      </span>
                    )}

                    {selectedProduct.is_trending && (
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

                <h4>
                  Description
                </h4>

                <p>
                  {selectedProduct.description ||
                    "No description available."}
                </p>

              </div>

              {/* CATEGORY DETAILS */}

              <div className="product-detail-grid">

                <div className="product-detail-box">

                  <span>Category</span>

                  <strong>
                    {selectedProduct?.category
                      ?.category || "—"}
                  </strong>

                </div>

                <div className="product-detail-box">

                  <span>Sub Category</span>

                  <strong>
                    {selectedProduct?.subcategory
                      ?.subcategory || "—"}
                  </strong>

                </div>

                <div className="product-detail-box">

                  <span>Seller</span>

                  <strong>
                    {selectedProduct?.seller?.name ||
                      "—"}
                  </strong>

                </div>

                <div className="product-detail-box">

                  <span>Seller Email</span>

                  <strong>
                    {selectedProduct?.seller?.email ||
                      "—"}
                  </strong>

                </div>

              </div>

              {/* PRICE DETAILS */}

              <div className="product-detail-section">

                <h4>
                  Price Details
                </h4>

                <div className="product-detail-grid">

                  <div className="product-detail-box">
                    <span>Cost Price</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.cost_price
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>MRP</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.mrp
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Selling Price</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.estimated_selling_price
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Final Price</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.final_price
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Shipping Fee</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.shipping_fee
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Platform Fee</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.platform_fee
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Inhand Profit</span>
                    <strong>
                      {formatPrice(
                        selectedProduct.inhand_profit
                      )}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Discount</span>
                    <strong>
                      {selectedProduct.discount ||
                        "0%"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* STOCK & RETURN */}

              <div className="product-detail-section">

                <h4>
                  Stock & Return
                </h4>

                <div className="product-detail-grid">

                  <div className="product-detail-box">
                    <span>Total Stock</span>
                    <strong>
                      {selectedProduct.stock ?? 0}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Allow Return</span>
                    <strong>
                      {selectedProduct.allow_return
                        ? "Yes"
                        : "No"}
                    </strong>
                  </div>

                  <div className="product-detail-box">
                    <span>Return Window</span>
                    <strong>
                      {selectedProduct
                        .return_window_days
                        ? `${selectedProduct.return_window_days} Days`
                        : "—"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* VARIANTS */}

              <div className="product-detail-section">

                <div className="product-section-title-row">

                  <h4>
                    Variants
                  </h4>

                  <span className="tax-card-count">
                    {selectedProduct.variants
                      ?.length || 0}
                  </span>

                </div>

                {selectedProduct.variants?.length > 0 ? (

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

                        {selectedProduct.variants.map(
                          (variant) => (

                            <tr key={variant.id}>

                              <td>
                                {variant.sku || "—"}
                              </td>

                              <td>
                                {formatPrice(
                                  variant.price
                                )}
                              </td>

                              <td>
                                {variant.stock ?? 0}
                              </td>

                              <td>
                                {variant.color_id ??
                                  "—"}
                              </td>

                              <td>
                                {variant.size_id ??
                                  "—"}
                              </td>

                            </tr>

                          )
                        )}

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

      )}


{showAddProduct && (
  <div
    className="tax-modal-overlay"
    onClick={() => setShowAddProduct(false)}
  >
    <div
      className="tax-glass-modal product-add-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="tax-modal-header">
        <div>
          <h3>Add Product</h3>
          <p>Enter product details</p>
        </div>

        <button
          className="tax-modal-close-btn"
          onClick={() => setShowAddProduct(false)}
        >
          ×
        </button>
      </div>

      <div className="tax-modal-body">
        <div className="product-form-grid">

     <div className="product-form-group">
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
  <option value="">Select Category</option>

  {Array.isArray(categoryList) &&
    categoryList.map((category) => (
      <option key={category.id} value={category.id}>
        {category.category}
      </option>
    ))}
</select>
</div>
<div className="product-form-group">
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
    <option value="">Select Subcategory</option>
{subcategories.map((subcategory) => (
    <option
      key={subcategory.id}
      value={subcategory.id}
    >
      {subcategory.subcategory}
    </option>
  ))}
  </select>
</div>

          <div className="product-form-group">
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
            />
          </div>

          <div className="product-form-group">
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
            />
          </div>

          <div className="product-form-group full-width">
            <label>Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          {[
            ["cost_price", "Cost Price"],
            ["mrp", "MRP"],
            ["estimated_selling_price", "Estimated Selling Price"],
            ["price", "Price"],
            ["shipping_fee", "Shipping Fee"],
            ["stock", "Stock"],
            ["return_window_days", "Return Window Days"],
          ].map(([key, label]) => (
            <div className="product-form-group" key={key}>
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
              />
            </div>
          ))}

          {[
            ["status", "Active Status"],
            ["is_featured", "Featured"],
            ["is_bestseller", "Bestseller"],
            ["is_new", "New Product"],
            ["is_trending", "Trending"],
            ["allow_return", "Allow Return"],
          ].map(([key, label]) => (
            <div className="product-form-group" key={key}>
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

          <div className="product-form-group full-width">
            <label>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  image: e.target.files[0],
                })
              }
            />
          </div>

        </div>

        <div className="product-form-actions">
          <button
            type="button"
            className="product-cancel-btn"
            onClick={() => setShowAddProduct(false)}
          >
            Cancel
          </button>

         <button
  type="button"
  className="add-product-btn"
  onClick={handleAddProduct}
>
  <FaPlus />
  Add Product
</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}