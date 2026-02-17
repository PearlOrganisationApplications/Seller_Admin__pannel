import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as ProfileAPI from "../api/viewProfileApi";
import Defaulting from "../img/admin_profile.webp";

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    name: "", email: "", phone: "", gender: "",
    city: "", state: "", address: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("No session found. Redirecting to login...");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const res = await ProfileAPI.getProfile();

      // Handle the data structure returned by your backend
      const user = res.data.admin || res.data.data || res.data;

      setProfile(user);
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        state: user.state || "",
        city: user.city || "",
        address: user.address || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Profile Fetch Error:", err.response);

      if (err.response?.status === 401) {
        // If the token is invalid/expired, we MUST log out
        alert("Your session has expired or is invalid. Please log in again.");
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert("An error occurred while fetching profile data.");
        setLoading(false);
      }
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("phone", editData.phone);
      formData.append("gender", editData.gender);
      formData.append("city", editData.city);
      formData.append("state", editData.state);
      formData.append("address", editData.address);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await ProfileAPI.updateProfileData(formData);

      if (res.data.status || res.data.success) {
        alert("Profile updated successfully!");
        setEditMode(false);
        fetchProfile(); // Refresh the data from the server
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Update Failed";
      alert("Error: " + msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-xl">Loading Profile...</p>
      </div>
    );
  }

  // Define display image logic
  const displayImage = previewUrl
    ? previewUrl
    : (profile?.image ? `https://kalkideals.com/${profile.image}` : Defaulting);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-all"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 text-center">
          <h2 className="text-2xl font-bold mb-8 text-blue-400">Admin Profile</h2>

          {/* Image Section */}
          <div className="relative inline-block mb-8">
            <img
              src={displayImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              onError={(e) => { e.target.src = Defaulting; }}
            />
            {editMode && (
              <div
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 shadow-md transition-all"
              >
                ✎
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="text-left space-y-5">
            {Object.keys(editData).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key}</label>
                {editMode ? (
                  <input
                    disabled={key === "email"}
                    value={editData[key]}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    className={`w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 outline-none focus:border-blue-500 transition-all ${key === "email" ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                ) : (
                  <p className="text-gray-200 border-b border-gray-700 pb-2">
                    {profile?.[key] || "N/A"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-10">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-all shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setEditMode(false); setPreviewUrl(null); setSelectedFile(null); }}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold transition-all shadow-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}