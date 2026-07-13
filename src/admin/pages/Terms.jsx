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
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getTermsPolicies, updateTermsPolicies } from "../api/termsPoliciesApi";

export default function Terms() {
  const navigate = useNavigate();

  // Data States
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Stores the item being edited
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
    } finally {
      setLoading(false);
    }
  };

  // Open Modal logic
  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description });
    setShowModal(true);
  };

  // Handle POST Request
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await updateTermsPolicies(editingItem.id, formData);
      if (res.status) {
        alert("Updated successfully!");
        setShowModal(false);
        fetchContent(); // Refresh the list
      }
    } catch {
      alert("Failed to update content");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4] p-4 md:p-8 font-sans relative">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#0047AB] text-white p-2.5 rounded-lg shadow-md hover:bg-blue-800 transition-all"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Legal & Policies
            </h1>
            <p className="text-sm text-gray-500">
              View and update platform legal documentation
            </p>
          </div>
        </div>
        <button
          onClick={fetchContent}
          className="flex items-center gap-2 bg-white text-[#0047AB] border border-[#0047AB] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-sm"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* CONTENT LIST */}
      <div className="w-full grid grid-cols-1 gap-6">
        {" "}
        {loading ? (
          <div className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
        ) : (
          policies.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#0047AB]">
                    {item.title.toLowerCase().includes("terms") ? (
                      <FaGavel size={18} />
                    ) : (
                      <FaShieldAlt size={18} />
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 capitalize">
                    {item.title}
                  </h2>
                </div>
                <button
                  onClick={() => handleEditClick(item)}
                  className="bg-[#0047AB]/10 text-[#0047AB] px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0047AB] hover:text-white transition-all"
                >
                  <FaEdit /> Edit Content
                </button>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {item.description}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex justify-between">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0047AB] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaEdit size={20} />
                <h3 className="text-xl font-bold">Edit Policy Section</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="hover:rotate-90 transition-transform duration-200"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 md:p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Policy Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-700"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Description Content
                </label>
                <textarea
                  required
                  rows="8"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-600 leading-relaxed"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-4 px-6 bg-[#0047AB] text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <FaSyncAlt className="animate-spin" />
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
    </div>
  );
}
