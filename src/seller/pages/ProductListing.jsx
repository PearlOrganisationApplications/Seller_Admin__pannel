"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Upload, X, Plus, Loader2, Save } from "lucide-react";
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
    allow_returns: "within 3 days",
    stock_available: "40",
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
    imageFiles.forEach((f) => data.append("images[]", f));

    // Variants
    data.append("variants[0][color_id]", formData.selectedColors[0] || "1");
    data.append("variants[0][size_id]", formData.selectedSizes[0] || "1");
    data.append("variants[0][price]", formData.estimated_selling_price);
    data.append("variants[0][stock]", formData.stock_available);
    data.append("variants[0][sku]", "KL_" + Date.now());

    // Append Dynamic Specifications
    Object.entries(formData.specs).forEach(([k, v]) => {
      data.append(`specifications[${k}]`, v);
    });

    data.append("cost_price", formData.cost_price);
    data.append("mrp", formData.mrp);
    data.append("estimated_selling_price", formData.estimated_selling_price);
    data.append("shipping_fee", formData.shipping_fee);
    data.append(
      "show_delivery_charge",
      formData.show_delivery_charge.toLowerCase(),
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

  const platformFee = Number(formData.estimated_selling_price || 0) * 0.1;
  const inHandProfit =
    Number(formData.estimated_selling_price || 0) -
    Number(formData.cost_price || 0) -
    platformFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-100 pb-20 font-sans">
      {" "}
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => (step === 1 ? navigate(-1) : setStep(1))}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Product Listing</h1>
        </div>
        <div className="flex gap-2">
          <span
            className={`w-2 h-2 rounded-full ${step === 1 ? "bg-blue-500" : "bg-gray-200"}`}
          ></span>
          <span
            className={`w-2 h-2 rounded-full ${step === 2 ? "bg-blue-500" : "bg-gray-200"}`}
          ></span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {step === 1 ? (
          <div className="space-y-8">
            {/* 1. BASIC DETAILS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">
                Basic Details
              </h2>
              <div className="grid gap-4 max-w-md">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Category
                </label>
                <select
                  className="p-3 bg-gray-50 border rounded-lg"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.cetegory}
                    </option>
                  ))}
                </select>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Product Name
                </label>
                <input
                  className="p-3 bg-gray-50 border rounded-lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  className="p-3 bg-gray-50 border rounded-lg h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 2. COLORS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm font-bold text-gray-600 mb-4">
                Choose Colors
              </p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleItem("selectedColors", c.id)}
                    className={`p-2 border rounded-lg text-[10px] font-bold ${formData.selectedColors.includes(c.id.toString()) ? "bg-blue-600 text-white" : "bg-white text-gray-400"}`}
                  >
                    {c.color}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. SIZES */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm font-bold text-gray-600 mb-4">
                Choose Sizes
              </p>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleItem("selectedSizes", s.id)}
                    className={`p-2 border rounded-lg text-[10px] font-bold ${formData.selectedSizes.includes(s.id.toString()) ? "bg-blue-600 text-white" : "bg-white text-gray-400"}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. DYNAMIC SPECIFICATIONS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specLabels.length > 0 ? (
                  specLabels.map((s) => (
                    <div key={s.id}>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        {s.specification}
                      </label>
                      <input
                        className="w-full p-2 bg-gray-50 border rounded-lg text-xs"
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
                  <p className="text-xs text-gray-400">
                    Loading specifications...
                  </p>
                )}
              </div>
            </div>

            {/* 5. IMAGES */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-sm font-bold text-gray-700 mb-4">
                Product Images
              </h3>
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 mb-4 hover:bg-gray-100 transition"
              >
                <Plus size={30} className="text-gray-400" />
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={handleImage}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((p, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden border relative shadow-sm"
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
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-[#38B6FF] text-white rounded-lg font-bold text-xl hover:bg-blue-500 transition shadow-lg"
            >
              Continue to Pricing
            </button>
          </div>
        ) : (
          /* STEP 2: FULL PRICING SECTION */
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold mb-6 italic text-gray-800">
                Price Section
              </h2>

              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-200 p-2 font-bold text-xs">
                  Step 1: Basic Price inputs
                </div>
                <div className="bg-white divide-y">
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

                <div className="bg-gray-200 p-2 font-bold text-xs border-t">
                  Step 2: Shipping Fee
                </div>
                <div className="bg-white divide-y">
                  <PriceRow
                    label="Shipping Fee"
                    value={formData.shipping_fee}
                    desc="Product shipping cost"
                    onChange={(v) =>
                      setFormData({ ...formData, shipping_fee: v })
                    }
                  />
                  <div className="flex text-xs bg-gray-50">
                    <div className="w-1/3 p-4 border-r font-bold">
                      Delivery Charges to Customer?
                    </div>
                    <div className="w-1/3 p-4 border-r flex flex-col gap-2 items-center justify-center">
                      <label className="flex items-center gap-2 font-medium">
                        <input
                          type="radio"
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
                      <label className="flex items-center gap-2 font-medium">
                        <input
                          type="radio"
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
                    <div className="w-1/3 p-4 italic text-gray-400 text-[10px]">
                      If "Yes" fee is shown to customer
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 border-t space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Platform Fee (10%):</span>{" "}
                    <span className="font-bold">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1E4CF6]">
                    <span>Final Selling Price:</span>{" "}
                    <span>₹{formData.estimated_selling_price || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600">
                    <span>You in-hand Profit:</span>{" "}
                    <span>₹{inHandProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Stock
                  </label>
                  <input
                    className="w-full p-2 border rounded bg-gray-50"
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Returns
                  </label>
                  <select
                    className="w-full p-2 border rounded bg-gray-50"
                    value={formData.allow_returns}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allow_returns: e.target.value,
                      })
                    }
                  >
                    <option>No</option>
                    <option>within 3 days</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Delivery
                  </label>
                  <select className="w-full p-2 border rounded bg-gray-50">
                    <option>Through kalkideals</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#38B6FF] text-white rounded-lg font-bold text-xl shadow-lg hover:bg-blue-500 transition"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Submit Product"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PriceRow = ({ label, value, desc, onChange }) => (
  <div className="flex text-xs">
    <div className="w-1/3 p-4 border-r font-bold bg-gray-50/50 text-gray-600">
      {label}
    </div>
    <div className="w-1/3 p-4 border-r flex items-center justify-center">
      <div className="flex items-center border rounded-full px-3 py-1 w-full bg-white ring-1 ring-gray-100 shadow-inner">
        <span className="text-gray-400 mr-1">₹</span>
        <input
          type="number"
          className="w-full outline-none"
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
