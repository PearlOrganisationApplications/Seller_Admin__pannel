import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/Advertisement.css";

const Advertisement = () => {
  const navigate = useNavigate();

  const [ads, setAds] = useState([
    { id: 1, image: null, target: "Product Listing Page" },
    { id: 2, image: null, target: "Product Page" },
    { id: 3, image: null, target: "Product Listing Page" },
    { id: 4, image: null, target: "Product Listing Page" },
    { id: 5, image: null, target: "Product Listing Page" },
    { id: 6, image: null, target: "Product Listing Page" },
    { id: 7, image: null, target: "Product Listing Page" },
  ]);

  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedAds = ads.map((ad) =>
      ad.id === id ? { ...ad, image: URL.createObjectURL(file) } : ad
    );
    setAds(updatedAds);
  };

  return (
    <div className={`advertisement-container ${localStorage.getItem("darkMode") === "true" ? "dark-mode" : ""}`}>
      {/* Header with Back button on the right */}
      <div className="advertisement-header">
        <h2>Advertisement (Home Screen)</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
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
