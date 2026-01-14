import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- OPTIONS ---------------- */

const categoryOptions = [
  "Clothing",
  "Footwear",
  "Accessories",
  "Electronics",
  "Home & Kitchen",
];

const productOptions = [
  "T-Shirt",
  "Jeans",
  "Jacket",
  "Sneakers",
  "Watch",
];

const colorOptions = [
  "Khaki", "Light Pink", "Black", "Beige", "Brown",
  "Yellow", "Blue", "White", "Red", "Combo of different color",
];

const sizeOptions = [
  "0-2 yrs","2-5 yrs","5-10 yrs","10-16 yrs","10","26","28","28A","28C","28D",
  "28E","30","30A","30B","30C","30D","30E","32","32A","32B","32C","32D",
  "32E","34","34A","34B","34C","34D","34E","36","36A","36B","36C","36D",
  "36E","38","38A","38B","38C","38E","40","40A","40B","40C","40D","40E",
  "42B","2.4","2.6","2.8","4XL","5XL","6XL","7XL","8XL","9XL","XXS","XS",
  "S","M","L","XL",
];

/* ---------------- HOOK ---------------- */

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

/* ---------------- DROPDOWN ---------------- */

function Dropdown({ label, options, value, onChange, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative w-full" ref={ref}>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center border border-gray-200 rounded px-3 py-2 bg-white text-sm"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-auto bg-white border rounded shadow-lg z-50">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange?.(opt);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- PAGE ---------------- */

export default function ProductListing() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [sameProductDifferentColor, setSameProductDifferentColor] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const toggleColor = (c) =>
    setSelectedColors((p) => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const toggleSize = (s) =>
    setSelectedSizes((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((p) => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i) =>
    setImages((p) => p.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-medium">Product Listing</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="h-px bg-gray-200 mb-6" />

      {/* BASIC DETAILS */}
      <div className="space-y-4 max-w-xl">
        <Dropdown label="Select Category" options={categoryOptions} value={category} onChange={setCategory} />
        <Dropdown label="Product Name" options={productOptions} value={productName} onChange={setProductName} />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      {/* COLORS */}
      <div className="mt-8">
        <p className="text-sm mb-3">Choose available colors</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {colorOptions.map((c) => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className={`px-3 py-2 text-sm border rounded ${
                selectedColors.includes(c)
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* SIZES */}
      <div className="mt-8">
        <p className="text-sm mb-3">Choose available sizes</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {sizeOptions.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`px-3 py-2 text-sm border rounded ${
                selectedSizes.includes(s)
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* MANY DROPDOWNS */}
      <div className="mt-10">
        <p className="text-sm mb-4">Specify your product</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Dropdown label="Dial Shape" options={["Round", "Square", "Oval"]} />
              <Dropdown label="Gender" options={["Male", "Female", "Unisex"]} />
              <Dropdown label="Compatible Models" options={["Model A", "Model B", "Model C"]} />
              <Dropdown label="Occasion" options={["Casual", "Party", "Festive", "Office"]} />
              <Dropdown label="Fabric" options={["Cotton", "Silk", "Rayon", "Polyester"]} />
              <Dropdown label="Waist Rise" options={["Low", "Mid", "High"]} />
              <Dropdown label="Color" options={["Red", "Black", "White", "Blue", "Green"]} />
              <Dropdown label="Combo" options={["Single", "Pack of 2", "Pack of 3"]} />
              <Dropdown label="Heel Type" options={["Flat", "Block", "Wedge", "Kitten"]} />
              <Dropdown label="Fit/Shape" options={["Slim", "Regular", "Relaxed"]} />
              <Dropdown label="Used For" options={["Daily", "Gym", "Party", "Office"]} />
              <Dropdown label="Concern" options={["Comfort", "Style", "Support"]} />
              <Dropdown label="Bottom Length" options={["Above Knee", "Knee Length", "Full Length"]} />
              <Dropdown label="Material" options={["Plastic", "Metal", "Wood", "Fiber"]} />
              <Dropdown label="Type" options={["Basic", "Premium", "Designer"]} />
              <Dropdown label="Bottom Style" options={["Straight", "Flared", "Tapered"]} />
              <Dropdown label="Print or Pattern" options={["Solid", "Printed", "Striped"]} />
              <Dropdown label="Frame Shape" options={["Round", "Square", "Aviator"]} />
              <Dropdown label="Ornamentation" options={["None", "Embroidery", "Sequins"]} />
              <Dropdown label="Bottom Wear" options={["Jeans", "Trousers", "Skirts"]} />
              <Dropdown label="Frame Type" options={["Full Rim", "Half Rim", "Rimless"]} />
              <Dropdown label="Border" options={["Yes", "No"]} />
              <Dropdown label="Border Type" options={["Thin", "Thick", "Double"]} />
              <Dropdown label="No. of Components" options={["1", "2", "3"]} />
              <Dropdown label="Back Type" options={["Regular", "Backless", "Tie-up"]} />
              <Dropdown label="Surface Styling" options={["Plain", "Textured", "Glossy"]} />
              <Dropdown label="Type of Skin" options={["Normal", "Oily", "Dry"]} />
              <Dropdown label="Inner Fabric" options={["Cotton", "Polyester", "Nylon"]} />
              <Dropdown label="Top Pattern" options={["Solid", "Printed"]} />
              <Dropdown label="Type of Hair" options={["Short", "Medium", "Long"]} />
              <Dropdown label="Warranty Period" options={["No Warranty", "6 Months", "1 Year"]} />
              <Dropdown label="Padding" options={["Non-Padded", "Lightly Padded"]} />
              <Dropdown label="Card Slot" options={["2", "4", "6", "8"]} />
              <Dropdown label="Bottom Type" options={["Pants", "Shorts", "Tights"]} />
              <Dropdown label="Lens Material" options={["Glass", "Polycarbonate"]} />
              <Dropdown label="Base Metal" options={["Alloy", "Brass", "Stainless Steel"]} />
              <Dropdown label="Dial Design" options={["Simple", "Designer"]} />
              <Dropdown label="Flavour" options={["Vanilla", "Chocolate", "Strawberry"]} />
              <Dropdown label="Shade" options={["Light", "Medium", "Dark"]} />
              <Dropdown label="Brand Name" options={["Nike", "Adidas", "Zara", "H&M"]} />
        </div>
      </div>

      {/* IMAGES */}
       <div className="mt-10">
        <h2 className="text-sm font-medium mb-3">Add Product Image (at least 3 smartly)</h2>

        <div className="flex flex-col items-center">
          
          {/* Large Upload Button */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-gray-300 w-40 h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            <span className="text-3xl font-bold">+</span>
            <p className="text-sm mt-1">Upload photos</p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  className="w-24 h-24 object-cover rounded-md border"
                />

                {/* Delete Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Small + Add More */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-24 h-24 border rounded-md border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <span className="text-3xl font-bold">+</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-10 flex gap-3">
        <button className="px-4 py-2 border rounded">Cancel</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Save & Continue</button>
      </div>
    </div>
  );
}
