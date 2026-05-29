import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/Advertisement.css";

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
    <div className={`advertisement-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="advertisement-header">
        <h2>Advertisement (Home Screen)</h2>
        <button className="back-btn" onClick={handleBack}>
          ⬅️ Back
        </button>
      </div>

      <div className="advertisement-table">
        <div className="advertisement-row header">
          <span>Image Upload</span>
          <span>Target Link</span>
          <span>Action</span>
        </div>

        {ads.map((ad) => (
          <div className="advertisement-row" key={ad.id}>
            <div className="image-upload">
              <label htmlFor={`upload-${ad.id}`} className="upload-box">
                {ad.image ? (
                  <img src={ad.image} alt="Uploaded" />
                ) : (
                  <span className="upload-icon">⬆️</span>
                )}
              </label>

              <input
                id={`upload-${ad.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, ad.id)}
              />
            </div>

            <div className="target-link">
              <button className="target-btn">{ad.target}</button>
            </div>

            <div className="done-btn-container">
              <button className="done-btn">Done</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advertisement;
