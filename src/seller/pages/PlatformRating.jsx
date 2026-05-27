import React, { useState, useEffect } from "react";
import { Star, Send, Trash2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import {
  submitSellerRating,
  updateSellerRating,
  deleteSellerRating,
  getMyRatings,
} from "../api/sellerRatingApi";

export default function PlatformRating() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [myRatings, setMyRatings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    fetchMyRatings();
  }, []);

  const fetchMyRatings = async () => {
    try {
      const res = await getMyRatings();
      // Defensive check: handle if res.data is an array, a single object, or null
      if (res.status && res.data) {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setMyRatings(data);
      } else {
        setMyRatings([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMyRatings([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");

    const loadingToast = toast.loading(
      editingId ? "Updating..." : "Submitting...",
    );
    setLoading(true);

    try {
      const data = { rating, comment };
      const res = editingId
        ? await updateSellerRating(editingId, data)
        : await submitSellerRating(data);

      if (res.status) {
        toast.success(res.message, { id: loadingToast });
        setRating(0);
        setComment("");
        setEditingId(null);
        fetchMyRatings(); // Refresh list after submission
      }
    } catch (err) {
      toast.error("Operation failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setRating(item.rating);
    setComment(item.comment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ... existing imports

  const handleDelete = (id) => {
    setDeleteId(id);
  };
  const executeDelete = async (id) => {
    const tid = toast.loading("Deleting feedback...");
    try {
      const res = await deleteSellerRating(id);
      if (res.status) {
        toast.success("Feedback removed successfully", { id: tid });
        fetchMyRatings();
      } else {
        toast.error(res.message || "Could not delete", { id: tid });
      }
    } catch (err) {
      toast.error("Network error: Delete failed", { id: tid });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <div className="relative w-full bg-[#0B1E3A] px-4 pt-6 pb-8 rounded-b-[3rem] shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Rate Our Admin Platform
          </h1>
          <p className="text-blue-200 mt-1 text-sm font-medium">
            Your feedback helps us improve the experience
          </p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-gray-600">
              Your Overall Experience
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    fill={(hover || rating) >= star ? "#FFAD01" : "none"}
                    color={(hover || rating) >= star ? "#FFAD01" : "#D1D5DB"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Feedback
            </label>
            <textarea
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              placeholder="Tell us what you like or how we can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0074A8] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#005e8a] transition-all"
            >
              <Send size={18} />{" "}
              {editingId ? "Update Feedback" : "Submit Rating"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setRating(0);
                  setComment("");
                }}
                className="px-6 py-3 border rounded-xl font-bold text-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Your Past Feedback
      </h3>
      <div className="space-y-4">
        {myRatings.length > 0 ? (
          myRatings.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 p-5 rounded-xl border flex justify-between items-start"
            >
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < item.rating ? "#FFAD01" : "none"}
                      color={i < item.rating ? "#FFAD01" : "#D1D5DB"}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{item.comment}</p>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Submitted on: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No feedback submitted yet.</p>
        )}
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Feedback
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this feedback?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await executeDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
