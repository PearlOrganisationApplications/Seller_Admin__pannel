import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as ProfileAPI from "../api/viewProfileApi";
import Defaulting from "../img/admin_profile.webp";
import { motion, AnimatePresence } from "framer-motion";
const getFieldIcon = (key) => {
  const iconClass =
    "w-5 h-5 text-indigo-500/80 transition-colors group-focus-within:text-indigo-600";
  switch (key) {
    case "name":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      );
    case "email":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      );
    case "phone":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.506-5.181-3.858-6.687-6.687l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
      );
    case "gender":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM18 18.75c0-1.243-.37-2.399-1.01-3.364M18 18.75h3.75m-3.75 0V15m-11.25 3.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM6.75 18.75c0-1.243.37-2.399 1.01-3.364m-1.01 3.364H3m3.75 0V15m11.25-3a6 6 0 1 0-10.5 0m10.5 0v-2.25m0 2.25H15M12 3v3.75"
          />
        </svg>
      );
    case "city":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
          />
        </svg>
      );
    case "state":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-10.5V18M3.75 8.25h16.5M3.75 12h16.5m-16.5 3.75h16.5M3.75 15.75h16.5M3 6h18M21 18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-1.5"
          />
        </svg>
      );
    case "address":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className={iconClass}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
    address: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No session found. Redirecting to login...");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const res = await ProfileAPI.getProfile();
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
        alert("Your session has expired or is invalid. Please log in again.");
        localStorage.removeItem("token");
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
        fetchProfile();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Update Failed";
      alert("Error: " + msg);
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      gender: "Gender Identity",
      city: "City",
      state: "State",
      address: "Street Address",
    };
    return labels[key] || key;
  };

  // Modern Skeleton Shimmer UI loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Animated Background Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/60 blur-[130px] animate-pulse delay-700" />

        <div className="w-full max-w-2xl px-4 z-10">
          <div className="h-10 w-44 bg-slate-200/80 rounded-xl mb-6 animate-pulse" />
          <div className="bg-white/90 rounded-3xl p-10 shadow-xl border border-slate-100 space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-slate-200 animate-pulse mb-6" />
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={i === 6 ? "sm:col-span-2 space-y-2" : "space-y-2"}
                >
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = previewUrl
    ? previewUrl
    : profile?.image
      ? `https://kalkideals.com/${profile.image}`
      : Defaulting;

  // Stagger configurations for elements entering the card
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col items-center relative overflow-hidden font-sans">
      {/* Dynamic ambient drifting background glows */}
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -15, 15, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/50 blur-[140px] pointer-events-none"
      />

      <div className="w-full z-10">
        {/* Back Button with hover arrow nudge */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/dashboard")}
          className="group mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 px-5 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm transition-all font-semibold text-sm backdrop-blur-sm"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>{" "}
          Back to Dashboard
        </motion.button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-10 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden"
        >
          {/* Top aesthetic gradient highlight */}
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          {/* Title Area */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Admin Profile
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Manage and review your account particulars
            </p>
          </div>

          {/* Profile Picture Frame with overlay hover effects */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group cursor-pointer">
              {/* Spinning gradient border accent on hover */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur opacity-25 group-hover:opacity-60 transition duration-700"></div>

              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = Defaulting;
                  }}
                />

                {/* Instant dark overlay overlay on Edit Mode hover */}
                {editMode && (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white text-xs font-semibold gap-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                      />
                    </svg>
                    <span>Change Image</span>
                  </div>
                )}
              </div>

              {/* Float Trigger Edit button (Pencil) */}
              <AnimatePresence>
                {editMode && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-full cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition-all border-2 border-white text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Staggered Field Matrix */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left"
          >
            {Object.keys(editData).map((key) => {
              const isFullWidth = key === "address" || key === "email";
              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className={`${isFullWidth ? "sm:col-span-2" : "col-span-1"} group space-y-2`}
                  layout
                >
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                    {getFieldLabel(key)}
                  </label>

                  {editMode ? (
                    key === "gender" ? (
                      /* Custom sliding physical segmented switch for gender parameter */
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 relative">
                        {["Male", "Female", "Other"].map((g) => {
                          const isSelected =
                            editData.gender?.toLowerCase() === g.toLowerCase();
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() =>
                                setEditData({ ...editData, gender: g })
                              }
                              className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors duration-200 ${
                                isSelected
                                  ? "text-indigo-600"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="activeGenderBg"
                                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50 -z-10"
                                  transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 28,
                                  }}
                                />
                              )}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Premium Interactive Field Inputs */
                      <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none">
                          {getFieldIcon(key)}
                        </div>
                        <input
                          disabled={key === "email"}
                          value={editData[key]}
                          onChange={(e) =>
                            setEditData({ ...editData, [key]: e.target.value })
                          }
                          className={`w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all ${
                            key === "email"
                              ? "opacity-60 cursor-not-allowed bg-slate-100/80 border-slate-200"
                              : "hover:border-slate-300"
                          }`}
                          placeholder={`Enter ${getFieldLabel(key).toLowerCase()}`}
                        />
                      </div>
                    )
                  ) : (
                    /* Display State cards */
                    <div className="group relative flex items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-slate-800 min-h-[58px] hover:bg-slate-50 transition-colors shadow-sm">
                      <div className="mr-3">{getFieldIcon(key)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 font-semibold truncate">
                          {profile?.[key] || (
                            <span className="text-slate-400 font-normal italic">
                              Not Provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Trigger Controls */}
          <div className="mt-10">
            {!editMode ? (
              <motion.button
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setEditMode(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/10 border border-white/10"
              >
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleSave}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-emerald-500/10 border border-white/10"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setEditMode(false);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold tracking-wide transition-all border border-slate-200 shadow-sm"
                >
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
