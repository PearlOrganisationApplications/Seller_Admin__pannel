"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Upload, X, Plus, Loader2, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addProduct,
  fetchCategories,
  fetchColors,
  fetchSizes,
  fetchSpecifications,
} from "../api/productListingApi";
import toast from "react-hot-toast";

export default function ProductListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Data States
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specLabels, setSpecLabels] = useState([]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    category_id: "",
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

  // FETCH ALL DATA ON MOUNT
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [catRes, colorRes, sizeRes, specRes] = await Promise.all([
          fetchCategories(),
          fetchColors(),
          fetchSizes(),
          fetchSpecifications(),
        ]);

        // Categories
        const catArray = Array.isArray(catRes) ? catRes : catRes.data || [];
        setCategories(catArray);
        if (catArray.length > 0)
          setFormData((prev) => ({
            ...prev,
            category_id: catArray[0].id.toString(),
          }));

        // Colors
        if (colorRes.status) setColors(colorRes.colors || []);

        // Sizes
        if (sizeRes.status) setSizes(sizeRes.sizes || []);

        // Dynamic Specifications
        if (specRes.status && specRes.specifications) {
          setSpecLabels(specRes.specifications);
          const initialSpecs = {};
          specRes.specifications.forEach((item) => {
            initialSpecs[item.specification] = "";
          });
          setFormData((prev) => ({ ...prev, specs: initialSpecs }));
        }
      } catch (err) {
        console.error("Data fetch failed", err);
        toast.error("Failed to load listing options");
      }
    };
    loadAllData();
  }, []);

  const toggleItem = (field, value) => {
    const valStr = value.toString();
    const current = formData[field];
    setFormData((prev) => ({
      ...prev,
      [field]: current.includes(valStr)
        ? current.filter((i) => i !== valStr)
        : [...current, valStr],
    }));
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleSubmit = async () => {
    if (!formData.name || imageFiles.length < 1) {
      toast.error("Product name and images are required");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();

    data.append("category_id", formData.category_id);
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
              <div className="grid gap-4 max-w-md">
                <FieldLabel>Category</FieldLabel>
                <select
                  className="glass-input"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white text-gray-800">
                      {c.category}
                    </option>
                  ))}
                </select>

                <FieldLabel>Product Name</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="e.g. Premium Cotton T-Shirt"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <FieldLabel>Description</FieldLabel>
                <textarea
                  className="glass-input h-24 resize-none"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </GlassCard>

            {/* 2. COLORS */}
            <GlassCard title="Choose Colors">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {colors.map((c) => {
                  const active = formData.selectedColors.includes(c.id.toString());
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleItem("selectedColors", c.id)}
                      className={`chip ${active ? "chip-active" : ""}`}
                    >
                      {c.color}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* 3. SIZES */}
            <GlassCard title="Choose Sizes">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {sizes.map((s) => {
                  const active = formData.selectedSizes.includes(s.id.toString());
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleItem("selectedSizes", s.id)}
                      className={`chip ${active ? "chip-active" : ""}`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* 4. DYNAMIC SPECIFICATIONS */}
            <GlassCard title="Specifications">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specLabels.length > 0 ? (
                  specLabels.map((s) => (
                    <div key={s.id}>
                      <FieldLabel small>{s.specification}</FieldLabel>
                      <input
                        className="glass-input text-xs py-2"
                        placeholder={`Enter ${s.specification}`}
                        value={formData.specs[s.specification] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              [s.specification]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))
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
                onClick={() => fileInputRef.current.click()}
                className="w-full h-32 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-purple-50/50 mb-4 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 group"
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
              onClick={() => setStep(2)}
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
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700">
                  Step 1: Basic Price Inputs
                </div>
                <div className="divide-y divide-purple-50">
                  <PriceRow
                    label="Cost Price"
                    value={formData.cost_price}
                    desc="How much product cost you"
                    onChange={(v) =>
                      setFormData({ ...formData, cost_price: v })
                    }
                  />
                  <PriceRow
                    label="MRP"
                    value={formData.mrp}
                    desc="Price shown as strikethrough"
                    onChange={(v) => setFormData({ ...formData, mrp: v })}
                  />
                  <PriceRow
                    label="Estimated Selling Price"
                    value={formData.estimated_selling_price}
                    desc="Final selling calculated automatically"
                    onChange={(v) =>
                      setFormData({ ...formData, estimated_selling_price: v })
                    }
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-2.5 font-bold text-[11px] uppercase tracking-wider text-purple-700 border-t border-purple-100">
                  Step 2: Shipping Fee
                </div>
                <div className="divide-y divide-purple-50">
                  <PriceRow
                    label="Shipping Fee"
                    value={formData.shipping_fee}
                    desc="Product shipping cost"
                    onChange={(v) =>
                      setFormData({ ...formData, shipping_fee: v })
                    }
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
                      If "Yes" fee is shown to customer
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                <div>
                  <FieldLabel small>Stock</FieldLabel>
                  <input
                    className="glass-input py-2"
                    type="number"
                    value={formData.stock_available}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_available: e.target.value,
                      })
                    }
                  />
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

const FieldLabel = ({ children, small }) => (
  <label
    className={`font-bold text-purple-500 uppercase tracking-wider ${small ? "text-[10px]" : "text-xs"}`}
  >
    {children}
  </label>
);

const PriceRow = ({ label, value, desc, onChange }) => (
  <div className="flex text-xs">
    <div className="w-1/3 p-4 border-r border-purple-100 font-bold bg-purple-50/40 text-gray-700">
      {label}
    </div>
    <div className="w-1/3 p-4 border-r border-purple-100 flex items-center justify-center">
      <div className="flex items-center border border-purple-200 rounded-full px-3 py-1.5 w-full bg-white focus-within:border-purple-400 focus-within:shadow-sm transition-all duration-200">
        <span className="text-purple-400 mr-1 font-bold">₹</span>
        <input
          type="number"
          className="w-full outline-none bg-transparent text-gray-800 placeholder:text-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
    <div className="w-1/3 p-4 italic text-gray-400 text-[10px] flex items-center">
      {desc}
    </div>
  </div>
);