"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaArrowLeft, FaTimes, FaSearch, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getKalkiCertificates, updateKalkiCertificate } from "../api/certificateApi"; 
import "./BarChart/KalkiCertified.css";
import toast from "react-hot-toast";

export default function KalkiCertified() {
  const [search, setSearch] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateData, setUpdateData] = useState({ status: 0, reason: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await getKalkiCertificates();
      if (response.success) {
        setCertificates(response.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (item) => {
    // Priority 1: Check the string status returned by backend
    // Priority 2: Check numeric kalki_certified flag
    const statusStr = (item.status || "").toLowerCase();
    const numeric = item.kalki_certified;

    if (statusStr === "approved" || numeric === 1 || numeric === "1") {
      return { text: "Approved", class: "approved", icon: <FaCheckCircle />, val: 1 };
    } else if (statusStr === "rejected" || numeric === 2 || numeric === "2") {
      return { text: "Rejected", class: "rejected", icon: <FaTimesCircle />, val: 2 };
    } else {
      return { text: "Pending", class: "pending", icon: <FaHourglassHalf />, val: 0 };
    }
  };

  const stats = useMemo(() => {
    return {
      total: certificates.length,
      approved: certificates.filter(c => getStatusDetails(c).val === 1).length,
      rejected: certificates.filter(c => getStatusDetails(c).val === 2).length,
      pending: certificates.filter(c => getStatusDetails(c).val === 0).length,
    };
  }, [certificates]);

  const filteredCertificates = certificates.filter(c => 
    (c.product_uid?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (c.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleEditClick = (item) => {
    setSelectedItem(item);
    const currentStatus = getStatusDetails(item);
    setUpdateData({
      status: currentStatus.val,
      reason: item.reason || ""
    });
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsUpdating(true);
    
    // Payload sent as per your JSON requirement
    const payload = {
      product_uid: selectedItem.product_uid,
      status: parseInt(updateData.status),
      reason: updateData.reason
    };

    const updatePromise = updateKalkiCertificate(payload);

    toast.promise(updatePromise, {
      loading: 'Updating certification...',
      success: (res) => {
        setShowModal(false);
        // We delay the refresh slightly to allow the server to settle
        setTimeout(() => fetchCertificates(), 500);
        return "Certification updated successfully!";
      },
      error: (err) => {
        return err.response?.data?.message || "Update failed. Please try again.";
      }
    });

    try {
      await updatePromise;
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="certified-container">
      {/* NO TOASTER HERE - It's handled globally in AdminApp.jsx */}

      <div className="header-section">
        <button className="back-btn-new" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="header-text">
          <h2>Kalkideals Certified</h2>
          <p>Manage and verify seller product certifications</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-info">
            <span>Total Requests</span>
            <h3>{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-info">
            <span>Approved</span>
            <h3>{stats.approved}</h3>
          </div>
          <FaCheckCircle className="stat-icon" />
        </div>
        <div className="stat-card pending">
          <div className="stat-info">
            <span>Pending</span>
            <h3>{stats.pending}</h3>
          </div>
          <FaHourglassHalf className="stat-icon" />
        </div>
        <div className="stat-card rejected">
          <div className="stat-info">
            <span>Rejected</span>
            <h3>{stats.rejected}</h3>
          </div>
          <FaTimesCircle className="stat-icon" />
        </div>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search UID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // FIXED: e.target.value
          />
        </div>
        <button className="refresh-btn" onClick={fetchCertificates}>Refresh Data</button>
      </div>

      <div className="table-wrapper">
        <table className="certified-table">
          <thead>
            <tr>
              <th>Product UID</th>
              <th>Seller Name</th>
              <th>Status</th>
              <th>Verification Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan="5"><div className="skeleton-line"></div></td>
                </tr>
              ))
            ) : filteredCertificates.length > 0 ? (
              filteredCertificates.map((item, index) => {
                const status = getStatusDetails(item);
                return (
                  <tr key={item.id || index}>
                    <td className="uid-cell">{item.product_uid}</td>
                    <td className="name-cell">{item.name}</td>
                    <td>
                      <span className={`status-pill ${status.class}`}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td className="reason-cell">
                      {item.reason || <span className="no-reason">No feedback provided</span>}
                    </td>
                    <td>
                      <button className="action-edit-btn" onClick={() => handleEditClick(item)}>
                        <FaEdit /> Review
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="empty-state">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content enhanced-modal">
            <div className="modal-header">
              <h3>Review Request</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            
            <div className="modal-body">
              <div className="item-summary">
                <p><strong>Seller:</strong> {selectedItem?.name}</p>
                <p><strong>UID:</strong> {selectedItem?.product_uid}</p>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label>Update Status</label>
                  <div className="status-selector">
                    <label className={`radio-option ${updateData.status == 0 ? 'active-pending' : ''}`}>
                      <input type="radio" name="status" value="0" checked={updateData.status == 0} onChange={(e)=>setUpdateData({...updateData, status: e.target.value})} />
                      Pending
                    </label>
                    <label className={`radio-option ${updateData.status == 1 ? 'active-approved' : ''}`}>
                      <input type="radio" name="status" value="1" checked={updateData.status == 1} onChange={(e)=>setUpdateData({...updateData, status: e.target.value})} />
                      Approve
                    </label>
                    <label className={`radio-option ${updateData.status == 2 ? 'active-rejected' : ''}`}>
                      <input type="radio" name="status" value="2" checked={updateData.status == 2} onChange={(e)=>setUpdateData({...updateData, status: e.target.value})} />
                      Reject
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason / Feedback</label>
                  <textarea 
                    required
                    rows="4"
                    value={updateData.reason}
                    onChange={(e) => setUpdateData({...updateData, reason: e.target.value})}
                    placeholder="Provide details for this status change..."
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Discard</button>
                  <button type="submit" className="btn-primary" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}