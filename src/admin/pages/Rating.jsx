import { useEffect, useState } from "react";
import { getAllRatings, deleteRating, updateRating } from "../api/ratingApi";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaStar, FaRegCommentDots } from "react-icons/fa";

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    rating: 5,
    comment: "",
  });

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const res = await getAllRatings();
      if (res.status) setRatings(res.data);
    } catch (err) {
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "12px", fontSize: "15px" }}>
            Are you sure you want to delete this rating?
          </p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingId = toast.loading("Deleting rating...");
                try {
                  const res = await deleteRating(id);
                  if (res.status) {
                    toast.success("Rating deleted successfully", {
                      id: loadingId,
                    });
                    setRatings((prev) => prev.filter((r) => r.id !== id));
                  } else {
                    toast.error(res.message || "Failed to delete", {
                      id: loadingId,
                    });
                  }
                } catch (err) {
                  toast.error("An error occurred", { id: loadingId });
                }
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Delete
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: "#1e293b",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: "top-center",
      },
    );
  };

  const handleEditClick = (item) => {
    setEditData({ id: item.id, rating: item.rating, comment: item.comment });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Updating...");
    try {
      const res = await updateRating(editData.id, {
        rating: editData.rating,
        comment: editData.comment,
      });
      if (res.status) {
        toast.success("Updated successfully", { id: tid });
        setIsModalOpen(false);
        fetchRatings();
      }
    } catch (err) {
      toast.error("Update failed", { id: tid });
    }
  };

  return (
    <div className="subcategory-page">
      <div className="page-header">
        <div>
          <h2>Rating Management</h2>
          <p className="page-subtitle">
            View, edit, and manage all seller ratings in one place
          </p>
        </div>
      </div>

      {loading ? (
        <div className="table-wrapper">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                padding: "14px 4px",
                alignItems: "center",
              }}
            >
              <div className="skeleton-bar" style={{ width: "40px" }} />
              <div className="skeleton-bar" style={{ width: "120px" }} />
              <div className="skeleton-bar" style={{ width: "70px" }} />
              <div className="skeleton-bar" style={{ width: "220px" }} />
              <div className="skeleton-bar" style={{ width: "90px" }} />
            </div>
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <div className="table-wrapper">
          <div className="empty-state">
            <FaRegCommentDots size={30} style={{ marginBottom: "8px" }} />
            <p>No ratings found.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Rating</th>
                <th>Comment</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, idx) => (
                <tr
                  key={r.id}
                  className="table-row-animate"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <td style={{ fontWeight: 600, color: "var(--ink-900)" }}>
                    {r.seller?.name || "N/A"}
                  </td>
                  <td>
                    <span className="rating-pill">
                      {r.rating} <FaStar className="star-icon" />
                    </span>
                  </td>
                  <td>{r.comment}</td>
<td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleEditClick(r)}
                      className="edit-btn"
                    >
                      <FaEdit style={{ marginRight: "4px" }} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="delete-btn"
                    >
                      <FaTrash style={{ marginRight: "4px" }} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="subcategory-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Edit Rating</h3>
                <p>Update the rating value or comment below</p>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={editData.rating}
                  onChange={(e) =>
                    setEditData({ ...editData, rating: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Comment</label>
                <textarea
                  required
                  value={editData.comment}
                  onChange={(e) =>
                    setEditData({ ...editData, comment: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
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

        .subcategory-page {
          padding: 28px;
          background: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 45%, #eef4ff 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ================= HEADER ================= */
        .page-header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 28px;
          position: relative;
          animation: fadeDown 0.5s ease;
        }

        .page-header > div {
          text-align: center;
        }

        .page-header h2 {
          font-size: 27px;
          font-weight: 800;
          color: var(--ink-900);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          margin: 4px 0 0 0;
          color: var(--slate-500);
          font-size: 13.5px;
        }

        /* ================= TABLE (GLASS CARD) ================= */
        .table-wrapper {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          padding: 22px;
          overflow-x: auto;
          box-shadow: 0 15px 40px rgba(30, 41, 59, 0.08);
          animation: fadeUp 0.5s ease;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
        }

        thead th {
          color: #fff;
          padding: 16px;
          font-size: 13.5px;
          font-weight: 600;
          text-align: left;
          letter-spacing: 0.01em;
        }

        thead th:first-child { border-radius: 12px 0 0 12px; }
        thead th:last-child { border-radius: 0 12px 12px 0; }

        tbody td {
          padding: 16px;
          font-size: 14px;
          color: var(--ink-700);
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        tbody tr {
          transition: background 0.2s ease, transform 0.2s ease;
        }

        tbody tr:hover {
          background: rgba(124, 58, 237, 0.06);
          transform: scale(1.005);
        }

        .table-row-animate {
          animation: rowFadeIn 0.4s ease both;
        }

        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .empty-state {
          text-align: center;
          padding: 30px;
          color: var(--slate-500);
          font-size: 14px;
        }

        /* ================= RATING PILL ================= */
        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.12));
          color: var(--ink-900);
          font-weight: 700;
          font-size: 13px;
        }

        .star-icon {
          color: #f59e0b;
        }

        /* ================= SKELETON LOADING ================= */
        .skeleton-bar {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 37%, #e2e8f0 63%);
          background-size: 400% 100%;
          animation: skeletonShimmer 1.4s ease infinite;
        }

        @keyframes skeletonShimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ================= BUTTONS ================= */
        .edit-btn,
        .delete-btn {
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .edit-btn {
          background: rgba(37, 99, 235, 0.12);
          color: var(--blue-500);
          margin-right: 8px;
        }

        .delete-btn {
          background: rgba(220, 38, 38, 0.12);
          color: #dc2626;
        }

        .edit-btn:hover {
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
        }

        .delete-btn:hover {
          background: linear-gradient(135deg, #dc2626, var(--ink-900));
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(220, 38, 38, 0.25);
        }

        .edit-btn:active,
        .delete-btn:active {
          transform: translateY(0) scale(0.96);
        }

        /* ================= MODAL (GLASSMORPHISM) ================= */
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
          animation: overlayFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .subcategory-modal {
          width: 480px;
          max-width: 90%;
          max-height: 88vh;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 0 32px 32px;
          box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.45);
          animation: modalPopup 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin: 0 -32px 24px;
          padding: 26px 32px;
          background: linear-gradient(135deg, var(--ink-900), var(--purple-600));
          border-radius: 24px 24px 0 0;
        }

        .modal-header h3 {
          margin: 0;
          color: #fff;
          font-size: 21px;
          font-weight: 700;
        }

        .modal-header p {
          margin: 4px 0 0 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .close-modal-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          font-size: 16px;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .close-modal-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-700);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          color: var(--ink-900);
          transition: all 0.25s ease;
          outline: none;
          background: rgba(248, 250, 252, 0.8);
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-group textarea {
          resize: none;
          height: 85px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          background: #ffffff;
          border-color: var(--purple-500);
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.14);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 28px;
        }

        .cancel-btn {
          background: #f1f5f9;
          color: var(--slate-500);
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: var(--ink-900);
          color: #fff;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--blue-500), var(--purple-600));
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 20px rgba(109, 40, 217, 0.28);
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(109, 40, 217, 0.4);
        }

        .save-btn:active {
          transform: translateY(0) scale(0.97);
        }

        /* ================= ANIMATIONS ================= */
        @keyframes modalPopup {
          0% { opacity: 0; transform: scale(0.85) translateY(-20px); }
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

        /* ================= RESPONSIVE / TOUCH ================= */
        @media (max-width: 640px) {
          .subcategory-modal {
            padding: 0 20px 20px;
          }

          .modal-header {
            margin: 0 -20px 20px;
            padding: 22px 20px;
          }

          .edit-btn,
          .delete-btn,
          .save-btn,
          .cancel-btn {
            min-height: 44px;
          }
        }

        @media (hover: none) {
          .save-btn:hover,
          .edit-btn:hover,
          .delete-btn:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}