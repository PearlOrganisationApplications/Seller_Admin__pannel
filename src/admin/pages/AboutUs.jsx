import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAboutUs, updateAboutUs } from "../api/aboutUsApi"; 

export default function AboutUs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [content, setContent] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      const res = await getAboutUs();
      if (res.status && res.data) {
        setContent({
          title: res.data.title,
          description: res.data.description
        });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Correct Payload Structure
      const payload = {
        title: content.title,
        description: content.description
      };

      const res = await updateAboutUs(payload);
      
      if (res.status) {
        alert(res.message || "About Us updated successfully!");
        fetchAboutUsData(); // Refresh page data from server
      } else {
        alert("Update failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      alert("Error: " + errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="certified-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading Content...</div>
      </div>
    );
  }

  return (
    <div className="certified-container">
      <div className="header-section">
        <button className="back-btn-new" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="header-text">
          <h2>About Us Management</h2>
          <p>Update company profile information displayed on the platform</p>
        </div>
      </div>

      <div className="table-wrapper" style={{ padding: '30px', maxWidth: '900px' }}>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Page Title</label>
            <input 
              type="text" 
              required
              value={content.title} 
              onChange={(e) => setContent({ ...content, title: e.target.value })} 
              placeholder="e.g. About Kalki Deals"
            />
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Description / Content</label>
            <textarea 
              required
              rows="10" 
              value={content.description} 
              onChange={(e) => setContent({ ...content, description: e.target.value })} 
              placeholder="Describe your platform..."
              style={{ lineHeight: '1.6', fontSize: '15px' }}
            />
          </div>

          <div className="modal-footer" style={{ justifyContent: 'flex-start', marginTop: '30px' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isUpdating}
              style={{ 
                width: '240px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                opacity: isUpdating ? 0.7 : 1
              }}
            >
              <FaCloudUploadAlt /> 
              {isUpdating ? "Processing..." : "Update About Us"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}