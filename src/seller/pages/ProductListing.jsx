"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Upload, X, Plus, Loader2, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addProduct,
  fetchCategories,
  getSubcategoriesByCategory,
  fetchColors,
  fetchSizes,
  fetchSpecifications,
} from "../api/productListingApi";
import toast from "react-hot-toast";

// ---------- PRICING CONSTANTS ----------
const PLATFORM_FEE_PERCENT = 10;
// PDF formula: Profit = Final Selling Price - (Platform Fee + Shipping Fee*)
// Is formula me Cost Price minus nahi hota. Agar Cost Price bhi minus karna ho to true kar do.
const SUBTRACT_COST_PRICE_IN_PROFIT = false;

export default function ProductListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [subcategories, setSubcategories] = useState([]);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Data States
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specLabels, setSpecLabels] = useState([]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    category_id: "",
    subcategory_id: "",
    name: "",
    description: "",
    sell_different_colors: "no",
    selectedColors: [],
    selectedSizes: [],
    specs: {}, // Populated dynamically from API
    cost_price: "",
    mrp: "",
    estimated_selling_price: "",
    shipping_fee: "",
    show_delivery_charge: "yes",
    allow_returns: "No",
    stock_available: "",
    payments_available: "COD",
    delivery_method: "Through kalkideals",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // ---------- REAL-TIME PRICE CALCULATION ----------
  const num = (v) => parseFloat(v) || 0;

  const costPrice = num(formData.cost_price);
  const mrpValue = num(formData.mrp);
  const sellingPrice = num(formData.estimated_selling_price);
  const shippingFee = num(formData.shipping_fee);

  // Shipping fee sirf tab add/count hoti hai jab delivery charge customer ko NAHI dikhana ("No")
  const shippingInPrice =
    formData.show_delivery_charge === "no" ? shippingFee : 0;

  // Step 3: Platform Fee = 10% of Estimated Selling Price
  const platformFee = (sellingPrice * PLATFORM_FEE_PERCENT) / 100;

  // Step 4: Final Selling Price = Estimated Selling Price + Platform Fee (+ Shipping Fee if "No")
  const finalSellingPrice = sellingPrice + platformFee + shippingInPrice;

  // Step 5: Discount % (MRP vs Final Selling Price)
  const discountPercent =
    mrpValue > 0
      ? Math.max(0, ((mrpValue - finalSellingPrice) / mrpValue) * 100)
      : 0;

  // Step 5: In-hand profit = Final Selling Price - (Platform Fee + Shipping Fee*)
  const profit =
    finalSellingPrice -
    (platformFee + shippingInPrice) -
    (SUBTRACT_COST_PRICE_IN_PROFIT ? costPrice : 0);

  // Final Selling Price MRP se upar nahi jaana chahiye
  const exceedsMrp =
    mrpValue > 0 && sellingPrice > 0 && finalSellingPrice > mrpValue;

  // ---------- ERROR HELPERS ----------
  // Remove the error of a single field as soon as it is filled
  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  // Scroll to + focus the first field which has an error
  const focusField = (key) => {
    setTimeout(() => {
      const el = document.getElementById(`field-${key}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof el.focus === "function") {
          el.focus({ preventScroll: true });
        }
      }
    }, 50);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoryRes, colorRes, sizeRes, specRes] = await Promise.all([
          fetchCategories(),
          fetchColors(),
          fetchSizes(),
          fetchSpecifications(),
        ]);
        console.log("CATEGORY RESPONSE:", categoryRes);
        // Categories
        if (categoryRes?.status && Array.isArray(categoryRes.data?.data)) {
          setCategories(categoryRes.data.data);
        } else {
          setCategories([]);
        }

        // Colors
        if (colorRes?.status && Array.isArray(colorRes.colors)) {
          setColors(colorRes.colors);
        } else {
          setColors([]);
        }

        // Sizes
        if (sizeRes?.status && Array.isArray(sizeRes.sizes)) {
          setSizes(sizeRes.sizes);
        } else {
          setSizes([]);
        }

        // Specifications
        if (specRes?.status && Array.isArray(specRes.specifications)) {
          setSpecLabels(specRes.specifications);
        } else {
          setSpecLabels([]);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load product options");
      }
    };

    loadInitialData();
  }, []);

  // FETCH SUBCATEGORIES WHEN CATEGORY CHANGES
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!formData.category_id) {
        setSubcategories([]);
        return;
      }

      try {
        const res = await getSubcategoriesByCategory(formData.category_id);

        if (res?.status && Array.isArray(res.data)) {
          setSubcategories(res.data);
        } else {
          setSubcategories([]);
        }

        // Category change hone par old subcategory remove
        setFormData((prev) => ({
          ...prev,
          subcategory_id: "",
        }));
      } catch (error) {
        console.error("Failed to load subcategories:", error);
        setSubcategories([]);
        toast.error("Failed to load subcategories");
      }
    };

    loadSubcategories();
  }, [formData.category_id]);

  const toggleItem = (field, value) => {
    const valStr = value.toString();
    setFormData((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(valStr)
          ? current.filter((i) => i !== valStr)
          : [...current, valStr],
      };
    });
    // Selected -> error hata do
    clearError(field);
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    clearError("images");
    // allow selecting the same file again
    e.target.value = "";
  };

  const validateStep1 = () => {
    const newErrors = {};

    // NOTE: order of keys = order of fields on screen (first error gets focus)
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.subcategory_id)
      newErrors.subcategory_id = "Subcategory is required";
    if (!formData.name.trim()) newErrors.name = "Product Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.selectedColors.length === 0)
      newErrors.selectedColors = "Please select at least one color";
    if (formData.selectedSizes.length === 0)
      newErrors.selectedSizes = "Please select at least one size";

    specLabels.forEach((s) => {
      if (!formData.specs[s.specification]?.trim()) {
        newErrors[`spec_${s.specification}`] = `${s.specification} is required`;
      }
    });

    if (imageFiles.length === 0)
      newErrors.images = "Please upload at least one image";

    setErrors(newErrors);

    const keys = Object.keys(newErrors);
    if (keys.length > 0) {
      focusField(keys[0]);
      return false;
    }
    return true;
  };

  const handleContinueToPricing = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Step 2 (pricing) field update + error clear
  const setPriceField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (value !== "" && value !== null && value !== undefined) {
      clearError(key);
    }
  };

  const validateStep2 = () => {
    const newErrors = {};
    const isEmpty = (v) => v === "" || v === null || v === undefined;

    // order = order on screen (first error gets focus)
    if (isEmpty(formData.cost_price))
      newErrors.cost_price = "Cost Price is required";
    if (isEmpty(formData.mrp)) newErrors.mrp = "MRP is required";
    if (isEmpty(formData.estimated_selling_price))
      newErrors.estimated_selling_price = "Selling Price is required";
    if (isEmpty(formData.shipping_fee))
      newErrors.shipping_fee = "Shipping Fee is required";
    if (isEmpty(formData.stock_available))
      newErrors.stock_available = "Stock is required";

    setErrors(newErrors);

    const keys = Object.keys(newErrors);
    if (keys.length > 0) {
      focusField(keys[0]);
      return false;
    }

    // Final Selling Price MRP se upar -> aage nahi badh sakte
    if (exceedsMrp) {
      toast.error("Final Selling Price has exceeded the MRP");
      focusField("price_limit");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    if (!formData.name || imageFiles.length < 1) {
      toast.error("Product name and images are required");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();

    data.append("category_id", formData.category_id);
    data.append("subcategory_id", formData.subcategory_id);
    data.append("name", formData.name);
    data.append("description", formData.description);
    imageFiles.forEach((file) => {
      data.append("images[]", file);
    });
    const variantsPayload = formData.selectedColors.map((color, index) => ({
      color_id: color,
      size_id: formData.selectedSizes[index] || "1",
      stock: formData.stock_available,
      sku: `SKU_${Date.now()}_${index}`,
    }));
    data.append("variants", JSON.stringify(variantsPayload));

    data.append("specifications", JSON.stringify(formData.specs));

    data.append("cost_price", formData.cost_price);
    data.append("mrp", formData.mrp);
    data.append("stock", formData.stock_available);
    data.append("estimated_selling_price", formData.estimated_selling_price);
    data.append("shipping_fee", formData.shipping_fee);
    data.append("platform_fee", platformFee.toFixed(2));
    data.append("final_selling_price", finalSellingPrice.toFixed(2));
    data.append("discount_percent", discountPercent.toFixed(2));
    data.append("in_hand_profit", profit.toFixed(2));
    data.append(
      "show_delivery_charge",
      formData.show_delivery_charge.toLowerCase(),
    );
    data.append("allow_return", formData.allow_returns === "No" ? "no" : "yes");

    data.append(
      "return_window_days",
      formData.allow_returns === "within 7 days" ? 7 : 0,
    );

    try {
      const res = await addProduct(data);
      if (res.success) {
        toast.success(res.message || "Product added!");
        navigate("/seller/listed-products");
      } else {
        toast.error(res.message || "Failed to add product");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-purple-50 to-white font-sans overflow-x-hidden pb-24">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-300/25 rounded-full blur-[140px] animate-pulse-slower" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
      </div>

      {/* HEADER */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100 px-6 py-4 flex items-center justify-between shadow-md shadow-purple-100/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="p-2 rounded-full bg-white hover:bg-purple-50 border border-purple-100 text-purple-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-purple-900 tracking-tight flex items-center gap-2">
            Product Listing
            <Sparkles size={16} className="text-purple-400" />
          </h1>
        </div>
        <div className="flex gap-2">
          <span
            className={`h-2 rounded-full transition-all duration-500 ${step === 1 ? "w-8 bg-gradient-to-r from-purple-400 to-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.5)]" : "w-2 bg-purple-100"}`}
          ></span>
          <span
            className={`h-2 rounded-full transition-all duration-500 ${step === 2 ? "w-8 bg-gradient-to-r from-purple-400 to-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.5)]" : "w-2 bg-purple-100"}`}
          ></span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10">
        {step === 1 ? (
          <div className="space-y-8">
            {/* 1. BASIC DETAILS */}
            <GlassCard title="Basic Details">
              <div className="grid gap-4 max-w-2xl">
                {/* Category + Subcategory in one line */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <CustomDropdown
                      id="field-category_id"
                      hasError={!!errors.category_id}
                      value={formData.category_id}
                      placeholder="Choose Category"
                      options={categories}
                      labelKey="category"
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          category_id: value,
                          subcategory_id: "",
                        }));
                        if (value) clearError("category_id");
                      }}
                    />
                    <ErrorText message={errors.category_id} />
                  </div>

                  <div>
                    <FieldLabel>Subcategory</FieldLabel>
                    <CustomDropdown
                      id="field-subcategory_id"
                      hasError={!!errors.subcategory_id}
                      value={formData.subcategory_id}
                      placeholder={
                        formData.category_id
                          ? subcategories.length > 0
                            ? "Choose Subcategory"
                            : "No Subcategories Available"
                          : "Choose Category First"
                      }
                      options={subcategories}
                      labelKey="subcategory"
                      disabled={!formData.category_id || subcategories.length === 0}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          subcategory_id: value,
                        }));
                        if (value) clearError("subcategory_id");
                      }}
                    />
                    <ErrorText message={errors.subcategory_id} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Product Name</FieldLabel>
                    <input
                      id="field-name"
                      className={`glass-input ${errors.name ? "input-error" : ""}`}
                      placeholder="e.g. Premium Cotton T-Shirt"
                      value={formData.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFormData((prev) => ({ ...prev, name: v }));
                        if (v.trim()) clearError("name");
                      }}
                    />
                    <ErrorText message={errors.name} />
                  </div>

                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      id="field-description"
                      className={`glass-input h-[42px] resize-none ${errors.description ? "input-error" : ""}`}
                      placeholder="Describe your product..."
                      value={formData.description}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFormData((prev) => ({ ...prev, description: v }));
                        if (v.trim()) clearError("description");
                      }}
                    />
                    <ErrorText message={errors.description} />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 2. COLORS */}
            <GlassCard title="Choose Colors">
              <div
                id="field-selectedColors"
                tabIndex={-1}
                className={`grid grid-cols-3 md:grid-cols-5 gap-3 outline-none rounded-xl ${errors.selectedColors ? "group-error" : ""}`}
              >
                {colors.map((c) => {
                  const active = formData.selectedColors.includes(c.id.toString());
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleItem("selectedColors", c.id)}
                      className={`chip ${active ? "chip-active" : ""}`}
                    >
                      {c.color}
                    </button>
                  );
                })}
              </div>
              <ErrorText message={errors.selectedColors} />
            </GlassCard>

            {/* 3. SIZES */}
            <GlassCard title="Choose Sizes">
              <div
                id="field-selectedSizes"
                tabIndex={-1}
                className={`grid grid-cols-4 md:grid-cols-8 gap-3 outline-none rounded-xl ${errors.selectedSizes ? "group-error" : ""}`}
              >
                {sizes.map((s) => {
                  const active = formData.selectedSizes.includes(s.id.toString());
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleItem("selectedSizes", s.id)}
                      className={`chip ${active ? "chip-active" : ""}`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              <ErrorText message={errors.selectedSizes} />
            </GlassCard>

            {/* 4. DYNAMIC SPECIFICATIONS */}
            <GlassCard title="Specifications">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specLabels.length > 0 ? (
                  specLabels.map((s) => {
                    const errKey = `spec_${s.specification}`;
                    return (
                      <div key={s.id}>
                        <FieldLabel small>{s.specification}</FieldLabel>
                        <input
                          id={`field-${errKey}`}
                          className={`glass-input text-xs py-2 ${errors[errKey] ? "input-error" : ""}`}
                          placeholder={`Enter ${s.specification}`}
                          value={formData.specs[s.specification] || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              specs: {
                                ...prev.specs,
                                [s.specification]: v,
                              },
                            }));
                            if (v.trim()) clearError(errKey);
                          }}
                        />
                        <ErrorText message={errors[errKey]} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-purple-300 animate-pulse">
                    Loading specifications...
                  </p>
                )}
              </div>
            </GlassCard>

            {/* 5. IMAGES */}
            <GlassCard title="Product Images">
              <div
                id="field-images"
                tabIndex={-1}
                onClick={() => fileInputRef.current.click()}
                className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer bg-purple-50/50 mb-2 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 group outline-none ${errors.images ? "border-red-400" : "border-purple-200"}`}
              >
                <Plus
                  size={30}
                  className="text-purple-300 group-hover:text-purple-500 group-hover:scale-125 group-hover:rotate-90 transition-all duration-300"
                />
                <span className="text-[11px] text-purple-300 mt-2 group-hover:text-purple-500 transition">
                  Click to upload images
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={handleImage}
                />
              </div>
              <div className="mb-4">
                <ErrorText message={errors.images} />
              </div>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((p, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden border border-purple-100 relative shadow-md group hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <img
                      src={p}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFiles(imageFiles.filter((_, idx) => idx !== i));
                        setImagePreviews(
                          imagePreviews.filter((_, idx) => idx !== i),
                        );
                      }}
                      className="absolute top-0 right-0 bg-red-500/90 hover:bg-red-500 text-white p-0.5 rounded-bl-lg transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            <button
              onClick={handleContinueToPricing}
              className="btn-primary w-full py-4 text-xl"
            >
              Continue to Pricing
            </button>
          </div>
        ) : (
          /* STEP 2: FULL PRICING SECTION */
          <div className="space-y-8 animate-in fade-in duration-500">
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6 italic text-purple-900 tracking-tight">
                Price Section
              </h2>

              <div className="rounded-xl overflow-hidden mb-6 border border-purple-100">
                {/* STEP 1: BASIC PRICE INPUTS */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700">
                  Step 1: Basic Price Inputs
                </div>
                <div className="divide-y divide-purple-50">
                  <PriceRow
                    id="field-cost_price"
                    error={errors.cost_price}
                    label="Cost Price"
                    value={formData.cost_price}
                    desc="How much product cost you"
                    onChange={(v) => setPriceField("cost_price", v)}
                  />
                  <PriceRow
                    id="field-mrp"
                    error={errors.mrp}
                    label="MRP"
                    value={formData.mrp}
                    desc="Price shown as strikethrough"
                    onChange={(v) => setPriceField("mrp", v)}
                  />
                  <PriceRow
                    id="field-estimated_selling_price"
                    error={errors.estimated_selling_price}
                    label="Estimated Selling Price"
                    value={formData.estimated_selling_price}
                    desc="Final selling calculated automatically"
                    onChange={(v) =>
                      setPriceField("estimated_selling_price", v)
                    }
                  />
                </div>

                {/* STEP 2: SHIPPING FEE */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700 border-t border-purple-100">
                  Step 2: Shipping Fee
                </div>
                <div className="divide-y divide-purple-50">
                  <PriceRow
                    id="field-shipping_fee"
                    error={errors.shipping_fee}
                    label="Shipping Fee"
                    value={formData.shipping_fee}
                    desc="Product shipping cost"
                    onChange={(v) => setPriceField("shipping_fee", v)}
                  />
                  <div className="flex text-xs bg-purple-50/40">
                    <div className="w-1/3 p-4 border-r border-purple-100 font-bold text-gray-700">
                      Delivery Charges to Customer?
                    </div>
                    <div className="w-1/3 p-4 border-r border-purple-100 flex flex-col gap-2 items-center justify-center">
                      <label className="flex items-center gap-2 font-medium text-gray-600 cursor-pointer hover:text-purple-600 transition">
                        <input
                          type="radio"
                          className="accent-purple-500"
                          checked={formData.show_delivery_charge === "yes"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              show_delivery_charge: "yes",
                            })
                          }
                        />{" "}
                        Yes
                      </label>
                      <label className="flex items-center gap-2 font-medium text-gray-600 cursor-pointer hover:text-purple-600 transition">
                        <input
                          type="radio"
                          className="accent-purple-500"
                          checked={formData.show_delivery_charge === "no"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              show_delivery_charge: "no",
                            })
                          }
                        />{" "}
                        No
                      </label>
                    </div>
                    <div className="w-1/3 p-4 italic text-gray-400 text-[10px] flex items-center">
                      If "Yes" fee is shown to customer. If "No" free delivery
                      is shown and shipping fee is added to final price
                    </div>
                  </div>
                </div>

                {/* STEP 3: PLATFORM FEE (AUTO) */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700 border-t border-purple-100">
                  Step 3: Platform Fee (Auto-Calculated)
                </div>
                <div className="divide-y divide-purple-50">
                  <AutoRow
                    label={`Platform Fee (${PLATFORM_FEE_PERCENT}%)`}
                    prefix="₹"
                    value={platformFee.toFixed(2)}
                    desc={`${PLATFORM_FEE_PERCENT}% of Estimated Selling Price`}
                  />
                </div>

                {/* STEP 4: FINAL SELLING PRICE (AUTO) */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700 border-t border-purple-100">
                  Step 4: Final Selling Price (Auto-Calculated)
                </div>
                <div className="divide-y divide-purple-50">
                  <AutoRow
                    label="Final Selling Price"
                    prefix="₹"
                    value={finalSellingPrice.toFixed(2)}
                    danger={exceedsMrp}
                    desc="= Estimated Selling Price + Platform Fee (+ Shipping Fee if delivery is not shown to customer)"
                  />
                </div>

                {/* STEP 5: SYSTEM INSIGHTS (AUTO) */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700 border-t border-purple-100">
                  Step 5: System Insights (Auto-Calculated)
                </div>
                <div className="divide-y divide-purple-50">
                  <AutoRow
                    label="Discount (%)"
                    prefix="%"
                    value={discountPercent.toFixed(2)}
                    desc="= (MRP − Final Selling Price) ÷ MRP × 100"
                  />
                  <AutoRow
                    label="Your In-Hand Profit"
                    prefix="₹"
                    value={profit.toFixed(2)}
                    danger={profit < 0}
                    success={profit > 0}
                    desc="= Final Selling Price − (Platform Fee + Shipping Fee*). *Shipping fee counted only if “Show Customer” = No"
                  />
                </div>
              </div>

              {/* ERROR: FINAL SELLING PRICE > MRP */}
              {exceedsMrp && (
                <div
                  id="field-price_limit"
                  tabIndex={-1}
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 outline-none space-y-2"
                >
                  <p className="font-bold">
                    Estimated Selling Price is too high because the Final
                    Selling Price (₹{finalSellingPrice.toFixed(2)}) exceeds the
                    MRP (₹{mrpValue.toFixed(2)}).
                  </p>
                  <p>
                    You cannot proceed forward, because the Final Selling Price
                    has exceeded the MRP. Kindly adjust one or more of the
                    following to proceed:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Estimated Selling Price</li>
                    <li>Shipping</li>
                    <li>Or choose “Show Delivery Charges to Customer = Yes”</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                <div>
                  <FieldLabel small>Stock</FieldLabel>
                  <input
                    id="field-stock_available"
                    className={`glass-input py-2 ${errors.stock_available ? "input-error" : ""}`}
                    type="number"
                    value={formData.stock_available}
                    onChange={(e) =>
                      setPriceField("stock_available", e.target.value)
                    }
                  />
                  <ErrorText message={errors.stock_available} />
                </div>
                <div>
                  <FieldLabel small>Returns</FieldLabel>
                  <select
                    className="glass-input py-2"
                    value={formData.allow_returns}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allow_returns: e.target.value,
                      })
                    }
                  >
                    <option className="bg-white">No</option>
                    <option className="bg-white">within 7 days</option>
                  </select>
                </div>
                <div>
                  <FieldLabel small>Delivery</FieldLabel>
                  <select className="glass-input py-2">
                    <option className="bg-white">Through kalkideals</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-xl"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Submit Product"
                )}
              </button>
            </GlassCard>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.12); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 11s ease-in-out infinite; }

        .glass-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(196, 181, 253, 0.5);
          border-radius: 0.75rem;
          color: #4c1d95;
          outline: none;
          transition: all 0.25s ease;
        }
        .glass-input::placeholder { color: rgba(147, 51, 234, 0.3); }
        .glass-input:focus {
          background: #ffffff;
          border-color: rgba(168, 85, 247, 0.7);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }

        /* Error state for inputs */
        .glass-input.input-error {
          border-color: rgba(239, 68, 68, 0.8);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
        }
        .glass-input.input-error:focus {
          border-color: rgba(239, 68, 68, 1);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }
        .group-error {
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.35);
          padding: 6px;
        }

        .chip {
          padding: 0.6rem 0.5rem;
          border-radius: 0.75rem;
          font-size: 11px;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid rgba(196, 181, 253, 0.5);
          color: rgba(126, 34, 206, 0.6);
          transition: all 0.25s ease;
        }
        .chip:hover {
          background: rgba(245, 243, 255, 1);
          border-color: rgba(168,85,247,0.5);
          color: #7e22ce;
          transform: translateY(-2px);
        }
        .chip-active {
          background: linear-gradient(135deg, #c084fc, #a855f7);
          border-color: rgba(216,180,254,0.8);
          color: white;
          box-shadow: 0 4px 20px rgba(168,85,247,0.35);
          transform: translateY(-2px);
        }

        .btn-primary {
          position: relative;
          font-weight: 800;
          color: white;
          border-radius: 1rem;
          background: linear-gradient(135deg, #c084fc 0%, #a855f7 55%, #7e22ce 100%);
          border: 1px solid rgba(216,180,254,0.6);
          box-shadow: 0 10px 30px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.35);
          background: linear-gradient(135deg, #d8b4fe 0%, #c084fc 55%, #9333ea 100%);
        }
        .btn-primary:active { transform: translateY(-1px) scale(0.99); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}

const GlassCard = ({ title, children }) => (
  <div className="relative rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(168,85,247,0.08)] p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-[0_8px_40px_rgba(168,85,247,0.15)]">
    {title && (
      <h2 className="text-lg font-bold mb-6 pb-3 border-b border-purple-100 text-purple-900 tracking-tight">
        {title}
      </h2>
    )}
    {children}
  </div>
);

const ErrorText = ({ message }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

const CustomDropdown = ({
  id,
  value,
  placeholder,
  options = [],
  labelKey,
  onChange,
  disabled = false,
  hasError = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(
    (item) => item.id?.toString() === value?.toString()
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative custom-dropdown">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full min-h-[42px] px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200
          ${disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : open
              ? "bg-white border-purple-500 ring-2 ring-purple-100 text-purple-900"
              : hasError
                ? "bg-white/90 border-red-400 ring-2 ring-red-100 text-purple-700 hover:border-red-500"
                : "bg-white/90 border-purple-200 text-purple-700 hover:border-purple-400"
          }`}
      >
        <span className="text-sm truncate">
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>

        <span
          className={`ml-2 text-purple-500 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        >
          ▼
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border border-purple-200 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-[120px] overflow-y-auto">
            {/* Placeholder */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                ${!value
                  ? "bg-purple-600 text-white font-semibold"
                  : "text-purple-800 hover:bg-purple-50"
                }`}
            >
              {placeholder}
            </button>

            {options.map((item) => {
              const isSelected =
                item.id?.toString() === value?.toString();

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onChange(item.id.toString());
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                    ${isSelected
                      ? "bg-purple-100 text-purple-800 font-semibold"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                >
                  {item[labelKey]}
                </button>
              );
            })}

            {options.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FieldLabel = ({ children, small }) => (
  <label
    className={`font-bold text-purple-500 uppercase tracking-wider ${small ? "text-[10px]" : "text-xs"}`}
  >
    {children}
  </label>
);

const PriceRow = ({ id, error, label, value, desc, onChange }) => (
  <div className="flex text-xs">
    <div className="w-1/3 p-4 border-r border-purple-100 font-bold bg-purple-50/40 text-gray-700">
      {label}
    </div>
    <div className="w-1/3 p-4 border-r border-purple-100 flex flex-col items-center justify-center">
      <div
        className={`flex items-center border rounded-full px-3 py-1.5 w-full bg-white focus-within:shadow-sm transition-all duration-200 ${error ? "border-red-400 focus-within:border-red-500" : "border-purple-200 focus-within:border-purple-400"}`}
      >
        <span className="text-purple-400 mr-1 font-bold">₹</span>
        <input
          id={id}
          type="number"
          className="w-full outline-none bg-transparent text-gray-800 placeholder:text-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1 self-start pl-3">{error}</p>}
    </div>
    <div className="w-1/3 p-4 italic text-gray-400 text-[10px] flex items-center">
      {desc}
    </div>
  </div>
);

// Read-only, auto-calculated row (Platform Fee, Final Price, Discount, Profit)
const AutoRow = ({ label, value, desc, prefix = "₹", danger, success }) => (
  <div className="flex text-xs">
    <div className="w-1/3 p-4 border-r border-purple-100 font-bold bg-purple-50/40 text-gray-700">
      {label}
    </div>
    <div className="w-1/3 p-4 border-r border-purple-100 flex items-center justify-center">
      <div
        className={`flex items-center border rounded-full px-3 py-1.5 w-full ${danger ? "border-red-300 bg-red-50" : "border-purple-100 bg-purple-50/60"}`}
      >
        <span className="text-purple-400 mr-1 font-bold">{prefix}</span>
        <span
          className={`font-bold ${danger ? "text-red-500" : success ? "text-green-600" : "text-gray-800"}`}
        >
          {value}
        </span>
      </div>
    </div>
    <div className="w-1/3 p-4 italic text-gray-400 text-[10px] flex items-center">
      {desc}
    </div>
  </div>
);