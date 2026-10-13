import React, { useState, useEffect } from "react";
import {
  X,
  RefreshCw,
  Package,
  IndianRupee,
  Truck,
  ImagePlus,
  Palette,
  Ruler,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Check,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchCategories,
  getSubcategoriesByCategory,
  fetchColors,
  fetchSizes,
} from "../../api/productListingApi";

const inputClass =
  "w-full rounded-xl border border-[#e8e0f2] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 hover:border-[#c9b4e5] focus:border-[#a78bca] focus:ring-4 focus:ring-[#b69ad9]/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

// API response se list nikalne ka helper (alag-alag response shapes ke liye)
const pickList = (res, key) => {
  if (Array.isArray(res)) return res;
  if (key && Array.isArray(res?.[key])) return res[key];
  if (Array.isArray(res?.data)) return res.data;
  if (key && Array.isArray(res?.data?.[key])) return res.data[key];
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

// API kabhi string me JSON deti hai, isliye safe parse
const parseJson = (value, fallback) => {
  if (typeof value !== "string") return value ?? fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const variantKey = (colorId, sizeId) => `${colorId}-${sizeId}`;

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SectionHeader = ({ icon: Icon, title, description, right }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3edfa] text-[#8764ad]">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </div>

    {right}
  </div>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  min,
  step,
  placeholder,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={min}
      step={step}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className={inputClass}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value ?? "yes"}
      onChange={onChange}
      className={inputClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Category / Subcategory dropdown (API data ke liye)
const DropdownField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  loading = false,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      disabled={disabled || loading}
      className={inputClass}
    >
      <option value="">{loading ? "Loading..." : placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Color / Size chip selector
const ChipGrid = ({
  items,
  selected,
  onToggle,
  labelKey,
  loading,
  emptyText,
  gridClass,
}) => {
  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (!items.length) return <p className="text-sm text-gray-400">{emptyText}</p>;

  return (
    <div className={`grid gap-3 ${gridClass}`}>
      {items.map((item) => {
        const id = String(item.id);
        const active = selected.includes(id);

        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            aria-pressed={active}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-all duration-200 ${
              active
                ? "-translate-y-0.5 border-[#c9a8ec] bg-gradient-to-br from-[#b98ee3] to-[#9270b5] text-white shadow-lg shadow-[#9270b5]/30"
                : "border-[#ddd3f3] bg-white text-[#8f6bb8]/70 hover:-translate-y-0.5 hover:border-[#b69ad9] hover:bg-[#faf6ff] hover:text-[#7e5ba2]"
            }`}
          >
            {active && <Check size={12} strokeWidth={3} />}
            <span className="truncate">{item[labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function ResubmitProductModal({
  isOpen,
  product,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({});
  const [selectedColors, setSelectedColors] = useState([]); // ids (string)
  const [selectedSizes, setSelectedSizes] = useState([]); // ids (string)
  const [variantData, setVariantData] = useState({}); // { "colorId-sizeId": { stock, sku } }
  const [submitting, setSubmitting] = useState(false);

  // Dropdown / chip data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingAttrs, setLoadingAttrs] = useState(false);

  // Form ko product ke data se fill karo
  useEffect(() => {
    if (!isOpen || !product) return;

    setForm({
      category_id: product.category_id ?? "",
      subcategory_id: product.subcategory_id ?? "",
      name: product.name ?? "",
      slug: product.slug ?? "",
      sku: product.sku ?? "",
      short_description: product.short_description ?? "",
      description: product.description ?? "",
      unit: product.unit ?? "Piece",
      price: product.cost_price ?? product.price ?? "",
      mrp: product.mrp ?? "",
      estimated_selling_price: product.estimated_selling_price ?? "",
      show_delivery_charge: product.show_delivery_charge ?? "yes",
      shipping_fee: product.shipping_fee ?? "0",
      allow_return:
        product.allow_return === "no" ||
        product.allow_return === 0 ||
        product.allow_return === "0" ||
        product.allow_return === false
          ? "no"
          : "yes",
      return_window_days: product.return_window_days ?? 7,
      stock: product.stock ?? "",
      images: [],
    });

    // Purane variants se colors / sizes / stock / sku nikalo
    const oldVariants = parseJson(product.variants, []);
    const list = Array.isArray(oldVariants) ? oldVariants : [];

    const colorIds = [];
    const sizeIds = [];
    const data = {};

    list.forEach((v) => {
      const colorId = String(v?.color_id ?? v?.color?.id ?? "");
      const sizeId = String(v?.size_id ?? v?.size?.id ?? "");
      if (!colorId || !sizeId) return;

      if (!colorIds.includes(colorId)) colorIds.push(colorId);
      if (!sizeIds.includes(sizeId)) sizeIds.push(sizeId);

      data[variantKey(colorId, sizeId)] = {
        stock: v?.stock ?? "",
        sku: v?.sku ?? "",
      };
    });

    setSelectedColors(colorIds);
    setSelectedSizes(sizeIds);
    setVariantData(data);
    setSubmitting(false);
  }, [isOpen, product]);

  // Categories + Colors + Sizes fetch (modal khulte hi)
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadData = async () => {
      setLoadingCategories(true);
      setLoadingAttrs(true);

      const [catRes, colorRes, sizeRes] = await Promise.allSettled([
        fetchCategories(),
        fetchColors(),
        fetchSizes(),
      ]);

      if (cancelled) return;

      setCategories(
        catRes.status === "fulfilled" ? pickList(catRes.value) : []
      );
      setColors(
        colorRes.status === "fulfilled"
          ? pickList(colorRes.value, "colors")
          : []
      );
      setSizes(
        sizeRes.status === "fulfilled" ? pickList(sizeRes.value, "sizes") : []
      );

      if (
        catRes.status === "rejected" ||
        colorRes.status === "rejected" ||
        sizeRes.status === "rejected"
      ) {
        toast.error("Failed to load some product options");
      }

      setLoadingCategories(false);
      setLoadingAttrs(false);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Subcategories fetch (jab bhi category change ho)
  useEffect(() => {
    if (!isOpen) return;

    if (!form.category_id) {
      setSubcategories([]);
      return;
    }

    let cancelled = false;

    const loadSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const res = await getSubcategoriesByCategory(form.category_id);

        if (!cancelled) setSubcategories(pickList(res));
      } catch (err) {
        console.error("Subcategories load error:", err);
        if (!cancelled) {
          setSubcategories([]);
          toast.error("Failed to load subcategories");
        }
      } finally {
        if (!cancelled) setLoadingSubcategories(false);
      }
    };

    loadSubcategories();

    return () => {
      cancelled = true;
    };
  }, [isOpen, form.category_id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, submitting]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? Array.from(files || []) : value,
    }));
  };

  // Name change -> slug auto (jab tak user ne slug khud edit nahi kiya)
  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => {
      const slugWasAuto = !prev.slug || prev.slug === slugify(prev.name);
      return {
        ...prev,
        name: value,
        slug: slugWasAuto ? slugify(value) : prev.slug,
      };
    });
  };

  // Category change -> subcategory reset
  const handleCategoryChange = (e) => {
    const { value } = e.target;

    setForm((prev) => ({
      ...prev,
      category_id: value,
      subcategory_id: "",
    }));
  };

  const toggleId = (setter) => (id) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const colorById = (id) => colors.find((c) => String(c.id) === String(id));
  const sizeById = (id) => sizes.find((s) => String(s.id) === String(id));

  // Default SKU: base-sku + color + size
  const autoSku = (colorId, sizeId) => {
    const color = (colorById(colorId)?.color || colorId)
      .toString()
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 3)
      .toUpperCase();
    const size = (sizeById(sizeId)?.size || sizeId)
      .toString()
      .replace(/[^a-zA-Z0-9.]/g, "")
      .toUpperCase();

    return [form.sku, color, size].filter(Boolean).join("-");
  };

  // Selected colors x sizes = variants payload (UI me nahi dikhta)
  const variantRows = selectedColors.flatMap((colorId) =>
    selectedSizes.map((sizeId) => {
      const key = variantKey(colorId, sizeId);
      const saved = variantData[key] || {};

      return {
        key,
        colorId,
        sizeId,
        stock: form.stock,
        sku: saved.sku || autoSku(colorId, sizeId),
      };
    })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedColors.length || !selectedSizes.length) {
      toast.error("Please select at least one color and one size");
      return;
    }

    // Exact payload (Postman form-data jaisa)
    const data = new FormData();

    data.append("category_id", form.category_id);
    data.append("subcategory_id", form.subcategory_id);
    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("sku", form.sku);
    data.append("short_description", form.short_description);
    data.append("description", form.description);
    data.append("unit", form.unit);
    data.append("price", form.price);
    data.append("mrp", form.mrp);
    data.append("estimated_selling_price", form.estimated_selling_price);
    data.append("show_delivery_charge", form.show_delivery_charge);
    data.append("shipping_fee", form.shipping_fee === "" ? 0 : form.shipping_fee);
    data.append("allow_return", form.allow_return);
    data.append(
      "return_window_days",
      form.allow_return === "yes" ? form.return_window_days || 0 : 0
    );

    (form.images || []).forEach((file) => data.append("images[]", file));

 
    selectedColors.forEach((colorId, i) => {
      data.append(`variants[${i}][color_id]`, colorId);

      selectedSizes.forEach((sizeId) => {
        data.append(`variants[${i}][size][]`, sizeId);
      });

      data.append(`variants[${i}][stock]`, form.stock);
      data.append(
        `variants[${i}][sku]`,
        variantRows.find((r) => r.colorId === colorId)?.sku ?? ""
      );
    });
   

    data.append("stock", form.stock);

    setSubmitting(true);

    try {
      await onSubmit({
        productId: product.id,
        formData: data,
      });
    } catch (error) {
      console.error("Resubmit failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.category,
  }));

  const subcategoryOptions = subcategories.map((s) => ({
    value: String(s.id),
    label: s.subcategory,
  }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#21152e]/35 p-3 backdrop-blur-[3px] sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#eee5f7] bg-white shadow-2xl shadow-[#5c4380]/15">
        {/* Header */}
        <div className="shrink-0 border-b border-[#eae0f5] bg-gradient-to-r from-[#f7f2fc] via-[#f3ebfb] to-[#eee5f8] px-5 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e7d8f5] bg-white text-[#8967ad] shadow-sm">
                <RefreshCw size={21} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-[#49365f] sm:text-xl">
                  Resubmit Product
                </h2>

                <p className="mt-0.5 text-xs text-[#857395] sm:text-sm">
                  Review and update your product details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close modal"
              className="shrink-0 rounded-xl border border-[#e8def2] bg-white/80 p-2 text-[#79658f] transition hover:bg-white hover:text-[#59416f] disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pl-0.5">
            <span className="rounded-lg border border-[#e6daf2] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#795b9b]">
              Product ID: #{product.id}
            </span>

            {product.product_uid && (
              <span className="max-w-full truncate rounded-lg border border-[#e6daf2] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#795b9b]">
                {product.product_uid}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto bg-[#fcfaff] p-4 sm:p-6">
            {/* Basic Information */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={Package}
                title="Basic Information"
                description="Product name, category and description"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DropdownField
                  label="Category"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder="Select category"
                  loading={loadingCategories}
                  required
                />

                <DropdownField
                  label="Subcategory"
                  name="subcategory_id"
                  value={form.subcategory_id}
                  onChange={handleChange}
                  options={subcategoryOptions}
                  placeholder={
                    form.category_id
                      ? subcategoryOptions.length
                        ? "Select subcategory"
                        : "No subcategories found"
                      : "Select category first"
                  }
                  loading={loadingSubcategories}
                  disabled={!form.category_id}
                  required
                />

                <Field
                  label="Product Name"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  required
                />

                <Field
                  label="Slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="SKU"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="e.g. Piece"
                  required
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Short Description"
                    name="short_description"
                    value={form.short_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={form.description ?? ""}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={IndianRupee}
                title="Pricing & Inventory"
                description="Manage pricing and available stock"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Price (₹)"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="MRP (₹)"
                  name="mrp"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.mrp}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Estimated Selling Price (₹)"
                  name="estimated_selling_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.estimated_selling_price}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            {/* Delivery & Returns */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={Truck}
                title="Delivery & Returns"
                description="Configure shipping charges and return policies"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Shipping Fee (₹)"
                  name="shipping_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shipping_fee}
                  onChange={handleChange}
                />

                <SelectField
                  label="Show Delivery Charge"
                  name="show_delivery_charge"
                  value={form.show_delivery_charge}
                  onChange={handleChange}
                  options={[
                    { value: "yes", label: "Yes, show charge" },
                    { value: "no", label: "No, hide charge" },
                  ]}
                />

                <SelectField
                  label="Allow Product Returns"
                  name="allow_return"
                  value={form.allow_return}
                  onChange={handleChange}
                  options={[
                    { value: "yes", label: "Returns allowed" },
                    { value: "no", label: "Returns not allowed" },
                  ]}
                />

                <Field
                  label="Return Window (Days)"
                  name="return_window_days"
                  type="number"
                  min="0"
                  value={form.allow_return === "yes" ? form.return_window_days : 0}
                  disabled={form.allow_return !== "yes"}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={ImagePlus}
                title="Product Images"
                description="Upload clear images of your product"
              />

              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#d9c5ed] bg-[#faf6ff] px-5 py-7 text-center transition hover:border-[#ae90d1] hover:bg-[#f5edff]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#e8dcf5] bg-white text-[#9674b8] shadow-sm">
                  <Upload size={22} />
                </div>

                <span className="text-sm font-bold text-[#59456f]">
                  Click to upload product images
                </span>

                <span className="mt-1 text-xs text-[#9787a7]">
                  JPG, PNG, WEBP or GIF · Multiple images supported
                </span>

                <input
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleChange}
                  className="sr-only"
                />
              </label>

              {form.images?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {form.images.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-[#eee7f5] bg-[#fcfaff] p-3"
                    >
                      <ImagePlus size={18} className="shrink-0 text-[#9674b8]" />

                      <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                        {file.name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Choose Colors */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={Palette}
                title="Choose Colors"
                description="Select all colors available for this product"
                right={
                  selectedColors.length > 0 && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#f3edfa] px-3 py-1 text-xs font-bold text-[#7e5ba2]">
                        {selectedColors.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedColors([])}
                        className="text-xs font-semibold text-[#9a85ad] hover:text-red-500"
                      >
                        Clear
                      </button>
                    </div>
                  )
                }
              />

              <ChipGrid
                items={colors}
                selected={selectedColors}
                onToggle={toggleId(setSelectedColors)}
                labelKey="color"
                loading={loadingAttrs && !colors.length}
                emptyText="No colors found."
                gridClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
              />
            </section>

            {/* Choose Sizes */}
            <section className="rounded-2xl border border-[#eee7f5] bg-white p-5 shadow-sm shadow-[#7c6096]/[0.03]">
              <SectionHeader
                icon={Ruler}
                title="Choose Sizes"
                description="Select all sizes available for this product"
                right={
                  selectedSizes.length > 0 && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#f3edfa] px-3 py-1 text-xs font-bold text-[#7e5ba2]">
                        {selectedSizes.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSizes([])}
                        className="text-xs font-semibold text-[#9a85ad] hover:text-red-500"
                      >
                        Clear
                      </button>
                    </div>
                  )
                }
              />

              <ChipGrid
                items={sizes}
                selected={selectedSizes}
                onToggle={toggleId(setSelectedSizes)}
                labelKey="size"
                loading={loadingAttrs && !sizes.length}
                emptyText="No sizes found."
                gridClass="grid-cols-3 sm:grid-cols-4 md:grid-cols-8"
              />
            </section>

            {/* Reminder */}
            <div className="flex items-start gap-3 rounded-xl border border-[#e9dcf5] bg-[#f7f1fd] p-4">
              <RotateCcw size={18} className="mt-0.5 shrink-0 text-[#8965ae]" />

              <div>
                <p className="text-sm font-semibold text-[#59416f]">
                  Before resubmitting
                </p>

                <p className="mt-1 text-xs leading-5 text-[#806d96]">
                  Please verify all product details carefully before submitting
                  them for review.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#eee7f5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
              <CheckCircle2 size={16} className="text-[#9474b4]" />
              Review all details before submission
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-[#e7ddec] bg-white px-5 py-2.5 text-sm font-semibold text-[#6e5c7e] transition hover:bg-[#faf7fd] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9270b5] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#9270b5]/20 transition hover:bg-[#7e5ba2] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={submitting ? "animate-spin" : ""} />

                {submitting ? "Submitting..." : "Submit for Review"}

                {!submitting && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}