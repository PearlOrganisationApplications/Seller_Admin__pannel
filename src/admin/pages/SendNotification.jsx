import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "../api/notificationApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function SendNotification() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("normal");

  const [previewImage, setPreviewImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedExtensions.includes(file.type)) {
      toast.error("Invalid Format! Please upload only JPG, JPEG, or PNG files.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large! Maximum size is 2MB.");
      e.target.value = "";
      return;
    }

    setRawFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter a title and message.");
      return;
    }

    if (type === "image" && !rawFile) {
      toast.error("Please upload an image for this notification type.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("body", message.trim());
    formData.append("send_to", audience);
    formData.append("type", type);

    if (type === "image" && rawFile) {
      formData.append("image", rawFile);
    }

    try {
      const result = await sendNotification(formData);

      if (result.success || result.status === true || result.status === "true") {
        toast.success("Notification sent successfully!");
        setTitle("");
        setMessage("");
        setRawFile(null);
        setPreviewImage(null);
        setType("normal");
      } else {
        toast.error(result.message || "Server rejected the request");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      const serverError =
        error.response?.data?.message || error.response?.data?.error || "Connection Error";
      toast.error("Failed: " + serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col items-center relative overflow-hidden font-sans">
      {/* Ambient background blobs, matching Support page */}
      <motion.div
        animate={{ x: [0, 15, -15, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -15, 15, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/50 blur-[140px] pointer-events-none"
      />

      <div className="w-full  z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Marketing Center
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Create and preview push notification campaigns
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Campaign card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.05 }}
            className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

            <h3 className="text-xl font-extrabold text-slate-800 mb-6">Create Campaign</h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title..."
                  className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                  Message Content
                </label>
                <textarea
                  placeholder="Notification body..."
                  className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 h-28 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                    To Whom
                  </label>
                  <select
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-semibold transition-all hover:border-slate-300"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="user">Customer</option>
                    <option value="seller">Sellers</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                    Type
                  </label>
                  <select
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-semibold transition-all hover:border-slate-300"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="normal">Normal (Text Only)</option>
                    <option value="image">Image (Photo + Text)</option>
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {type === "image" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-2 block">
                      Upload Banner (JPG/PNG only)
                    </label>
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="group cursor-pointer border-2 border-dashed border-indigo-200 rounded-2xl p-6 bg-indigo-50/60 hover:bg-indigo-100/50 flex flex-col items-center justify-center transition-all"
                    >
                      {previewImage ? (
                        <div className="text-center">
                          <img
                            src={previewImage}
                            className="max-h-32 rounded-xl shadow-sm mb-2 border border-slate-100"
                            alt="Selected"
                          />
                          <span className="text-xs text-indigo-600 font-bold">
                            Click to Change Image
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl mb-2 shadow-md shadow-indigo-500/20">
                            +
                          </div>
                          <p className="text-sm text-indigo-600 font-bold">
                            Click to upload photo
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -0.5 }}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                className={`w-full py-4 mt-2 rounded-2xl font-bold text-white tracking-wide transition-all text-sm shadow-md ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-indigo-500/20 border border-white/10"
                }`}
                onClick={handleSendNotification}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Notification"}
              </motion.button>
            </div>
          </motion.div>

          {/* Live Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", delay: 0.1 }}
            className="flex flex-col"
          >
            <h3 className="text-xl font-extrabold text-slate-400 mb-4 px-2">Live Preview</h3>

            <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

              <div className="flex items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
                  K
                </span>
                <div className="ml-3">
                  <p className="font-bold text-slate-800 text-sm leading-none">Kalki Deals</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1 tracking-widest font-bold">
                    Notification
                  </p>
                </div>
                <span className="ml-auto text-xs text-slate-400 font-semibold">Now</span>
              </div>

              <div className="space-y-3">
                <h5 className="font-extrabold text-lg text-slate-900 leading-snug">
                  {title || "Campaign Title"}
                </h5>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {message || "Message body..."}
                </p>
                <AnimatePresence>
                  {type === "image" && previewImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl overflow-hidden border border-slate-100"
                    >
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-full h-auto object-cover max-h-60"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="w-full mt-6 py-3 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 font-bold rounded-2xl border border-indigo-100 text-sm transition-colors shadow-sm">
                Open App
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}