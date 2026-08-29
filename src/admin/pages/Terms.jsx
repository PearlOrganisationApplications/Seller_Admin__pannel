"use client";
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaGavel,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getTermsPolicies, updateTermsPolicies } from "../api/termsPoliciesApi";
import toast from "react-hot-toast";

export default function Terms() {
  const navigate = useNavigate();

  // Data States
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getTermsPolicies();
      if (response.status) setPolicies(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const tid = toast.loading("Updating...");
    try {
      const res = await updateTermsPolicies(editingItem.id, formData);
      if (res.status) {
        toast.success("Updated successfully!", { id: tid });
        setShowModal(false);
        fetchContent();
      } else {
        toast.error(res.message || "Failed to update", { id: tid });
      }
    } catch {
      toast.error("Failed to update content", { id: tid });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="terms-page">
      {/* HEADER */}
      <div className="terms-header">
        <div className="terms-header-left">
         
          <div>
            <h1>Legal &amp; Policies</h1>
            <p className="page-subtitle">
              View and update platform legal documentation
            </p>
          </div>
        </div>
        <button onClick={fetchContent} className="refresh-btn">
          <FaSyncAlt className={loading ? "spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* CONTENT LIST */}
      <div className="terms-list">
        {loading ? (
          <>
            <div className="policy-card skeleton-card" />
            <div className="policy-card skeleton-card" />
          </>
        ) : policies.length === 0 ? (
          <div className="policy-card empty-card">
            <p>No policy sections found.</p>
          </div>
        ) : (
          policies.map((item, idx) => (
            <div
              key={item.id}
              className="policy-card"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="policy-card-header">
                <div className="policy-title-group">
                  <div className="policy-icon">
                    {item.title.toLowerCase().includes("terms") ? (
                      <FaGavel size={16} />
                    ) : (
                      <FaShieldAlt size={16} />
                    )}
                  </div>
                  <h2>{item.title}</h2>
                </div>
                <button
                  onClick={() => handleEditClick(item)}
                  className="edit-content-btn"
                >
                  <FaEdit /> Edit Content
                </button>
              </div>
              <div className="policy-card-body">
                <p>{item.description}</p>
                <div className="policy-meta">
                  <span>
                    Last Updated:{" "}
                    {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                  <span>Section ID: {item.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="subcategory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <FaEdit size={18} />
                <h3>Edit Policy Section</h3>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Policy Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description Content</label>
                <textarea
                  required
                  rows={8}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="save-btn"
                >
                  {isUpdating ? (
                    <span className="btn-spinner" />
                  ) : (
                    <FaSave />
                  )}
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --blue-500: #2563eb;
          --blue-700: #1d4ed8;
          --purple-500: #7c3aed;
          --purple-600: #6d28d9;
          --ink-900: #0f172a;
          --ink-700: #1e293b;
          --slate-500: #64748b;
          --white: #ffffff;
        }

        .terms-page {
          padding: 28px;
          background: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 45%, #eef4ff 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ================= HEADER ================= */
        .terms-header {
          max-width: 1000px;
          margin: 0 auto 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          animation: fadeDown 0.5s ease;
        }

        .terms-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(109, 40, 217, 0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .back-btn:hover {
          transform: translateX(-3px);
          box-shadow: 0 10px 24px rgba(109, 40, 217, 0.38);
        }

        .terms-header-left h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: var(--ink-900);
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          margin: 4px 0 0 0;
          color: var(--slate-500);
          font-size: 13.5px;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(10px);
          color: var(--purple-600);
          border: 1.5px solid rgba(124, 58, 237, 0.35);
          padding: 11px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .refresh-btn:hover {
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(109, 40, 217, 0.3);
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        /* ================= POLICY LIST ================= */
        .terms-list {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          gap: 22px;
        }

        .policy-card {
          background: rgba(255, 255, 255, 0.68);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(30, 41, 59, 0.08);
          animation: fadeUp 0.5s ease both;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .policy-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(30, 41, 59, 0.14);
        }

        .skeleton-card {
          height: 180px;
          background: linear-gradient(90deg, rgba(226,232,240,0.5) 25%, rgba(241,245,249,0.7) 37%, rgba(226,232,240,0.5) 63%);
          background-size: 400% 100%;
          animation: skeletonShimmer 1.4s ease infinite;
        }

        .empty-card {
          padding: 40px;
          text-align: center;
          color: var(--slate-500);
        }

        .policy-card-header {
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(124, 58, 237, 0.05);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .policy-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .policy-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15));
          color: var(--purple-600);
        }

        .policy-title-group h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--ink-900);
          text-transform: capitalize;
        }

        .edit-content-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--blue-500);
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .edit-content-btn:hover {
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
        }

        .policy-card-body {
          padding: 24px 28px;
        }

        .policy-card-body p {
          margin: 0;
          color: var(--ink-700);
          font-size: 15px;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .policy-meta {
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--slate-500);
        }

        /* ================= MODAL ================= */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.35), rgba(15, 23, 42, 0.75));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 16px;
          animation: overlayFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .subcategory-modal {
          width: 640px;
          max-width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 0 32px 32px;
          box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.45);
          animation: modalPopup 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 -32px 24px;
          padding: 26px 32px;
          background: linear-gradient(135deg, var(--ink-900), var(--purple-600));
          border-radius: 24px 24px 0 0;
        }

        .modal-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
        }

        .modal-header h3 {
          margin: 0;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .close-modal-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-modal-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--slate-500);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
          color: var(--ink-900);
          font-weight: 600;
          transition: all 0.25s ease;
          outline: none;
          background: rgba(248, 250, 252, 0.8);
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
          font-weight: 400;
          line-height: 1.6;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          background: #ffffff;
          border-color: var(--purple-500);
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.14);
        }

        .modal-actions {
          display: flex;
          gap: 14px;
          padding-top: 8px;
        }

        .cancel-btn {
          flex: 1;
          background: #f1f5f9;
          color: var(--slate-500);
          border: none;
          padding: 15px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: var(--ink-900);
          color: #fff;
        }

        .save-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          border: none;
          padding: 15px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 10px 24px rgba(109, 40, 217, 0.3);
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(109, 40, 217, 0.42);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ================= ANIMATIONS ================= */
        @keyframes modalPopup {
          0% { opacity: 0; transform: scale(0.9) translateY(-16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes skeletonShimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 640px) {
          .subcategory-modal {
            padding: 0 20px 20px;
          }

          .modal-header {
            margin: 0 -20px 20px;
            padding: 22px 20px;
          }

          .modal-actions {
            flex-direction: column;
          }

          .policy-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        @media (hover: none) {
          .save-btn:hover,
          .edit-content-btn:hover,
          .back-btn:hover,
          .refresh-btn:hover,
          .policy-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}