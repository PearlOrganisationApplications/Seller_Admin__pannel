import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "../api/notificationApi";
import "./BarChart/SendNotification.css";

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

    // STRICT VALIDATION: Check extension
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedExtensions.includes(file.type)) {
      alert("Invalid Format! Please upload only JPG, JPEG, or PNG files.");
      e.target.value = ""; // Clear input
      return;
    }

    // Check File Size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Maximum size is 2MB.");
      e.target.value = "";
      return;
    }

    setRawFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please enter a title and message.");
      return;
    }

    if (type === "image" && !rawFile) {
      alert("Please upload an image for this notification type.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("body", message.trim());
    formData.append("send_to", audience);
    formData.append("type", type);

    if (type === "image" && rawFile) {
      // Ensure the file is appended correctly
      formData.append("image", rawFile);
    }

    try {
      const result = await sendNotification(formData);

      // Some backends return status: true, others success: true
      if (result.success || result.status === true || result.status === "true") {
        alert("Notification sent successfully!");
        setTitle("");
        setMessage("");
        setRawFile(null);
        setPreviewImage(null);
        setType("normal");
      } else {
        alert(result.message || "Server rejected the request");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      // Capture the specific 422 error message from the server
      const serverError = error.response?.data?.message || error.response?.data?.error || "Connection Error";
      alert("Failed: " + serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-container min-h-screen pb-10 bg-gray-50 text-gray-800">
      <div className="nav flex items-center justify-between px-6 mb-8 shadow-lg bg-[#4375af]">
        <h3 className="text-white text-xl font-bold">Marketing Center</h3>
        <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg transition-all border border-white/30" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <div className="section p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Create Campaign</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-500">Notification Title</label>
              <input type="text" placeholder="Enter title..." className="w-full mt-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500">Message Content</label>
              <textarea placeholder="Notification body..." className="w-full mt-1 p-3 border border-gray-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-500">To Whom</label>
                <select className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none" value={audience} onChange={(e) => setAudience(e.target.value)}>
                  <option value="all">All</option>
                  <option value="user">Customer</option>
                  <option value="seller">Sellers</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500">Type</label>
                <select className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="normal">Normal (Text Only)</option>
                  <option value="image">Image (Photo + Text)</option>
                </select>
              </div>
            </div>

            {type === "image" && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-500 mb-2 block">Upload Banner (JPG/PNG only)</label>
                <div onClick={() => fileInputRef.current.click()} className="group cursor-pointer border-2 border-dashed border-blue-200 rounded-2xl p-6 bg-blue-50 hover:bg-blue-100/50 flex flex-col items-center justify-center transition-all">
                  {previewImage ? (
                    <div className="text-center">
                      <img src={previewImage} className="max-h-32 rounded-lg shadow-sm mb-2" alt="Selected" />
                      <span className="text-xs text-blue-600 font-medium">Click to Change Image</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xl mb-2">+</div>
                      <p className="text-sm text-blue-600 font-bold">Click to upload photo</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
            )}

            <button className={`w-full py-4 mt-6 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`} onClick={handleSendNotification} disabled={loading}>
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>

        {/* PREVIEW SECTION */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-400 mb-6 px-2">Live Preview</h2>
          <div className="preview-card bg-white shadow-2xl rounded-3xl p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">K</span>
              <div className="ml-3">
                <p className="font-bold text-gray-800 text-sm leading-none">Kalki Deals</p>
                <p className="text-[10px] text-gray-400 uppercase mt-1">Notification</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">Now</span>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-lg text-gray-900 leading-snug">{title || "Campaign Title"}</h5>
              <p className="text-gray-600 text-sm leading-relaxed">{message || "Message body..."}</p>
              {type === "image" && previewImage && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <img src={previewImage} alt="preview" className="w-full h-auto object-cover max-h-60" />
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100">Open App</button>
          </div>
        </div>
      </div>
    </div>
  );
}