import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Megaphone, Check } from "lucide-react";

const initialAds = [
  { id: 1, image: null, target: "Product Listing Page" },
  { id: 2, image: null, target: "Product Page" },
  { id: 3, image: null, target: "Product Listing Page" },
  { id: 4, image: null, target: "Product Listing Page" },
  { id: 5, image: null, target: "Product Listing Page" },
  { id: 6, image: null, target: "Product Listing Page" },
  { id: 7, image: null, target: "Product Listing Page" },
];

const Advertisement = () => {
  const navigate = useNavigate();
  const isDarkMode = useMemo(
    () => localStorage.getItem("darkMode") === "true",
    [],
  );

  const [ads, setAds] = useState(initialAds);

  const handleImageUpload = useCallback((e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, image: previewUrl } : ad)),
    );
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={`min-h-screen p-5 ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"}`}>
      <div className="flex items-center gap-4 mb-6">
      

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Megaphone className="text-white" size={26} />
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Advertisement
          </h2>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white/60 shadow-xl">
        <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
          <span className="px-5 py-4">Image Upload</span>
          <span className="px-5 py-4 text-center">Target Link</span>
          <span className="px-5 py-4 text-center">Action</span>
        </div>

        {ads.map((ad) => (
          <div
            key={ad.id}
            className="grid grid-cols-3 items-center border-b border-white/40 hover:bg-white/60 transition-all duration-200"
          >
            <div className="px-5 py-4">
              <label
                htmlFor={`upload-${ad.id}`}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                {ad.image ? (
                  <img src={ad.image} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={22} className="text-indigo-400" />
                )}
              </label>

              <input
                id={`upload-${ad.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, ad.id)}
              />
            </div>

            <div className="px-5 py-4 text-center">
              <button className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-300/40 text-xs font-semibold hover:bg-indigo-500/20 transition-all">
                {ad.target}
              </button>
            </div>

            <div className="px-5 py-4 text-center">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-200 hover:opacity-90 transition-all">
                <Check size={14} /> Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advertisement;