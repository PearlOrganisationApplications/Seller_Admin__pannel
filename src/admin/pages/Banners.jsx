import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight,
  Upload,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  getBannerList,
  addBanner,
  deleteBanner,
  updateBannerStatus,
} from "../api/bannerManagementApi";

const initialForm = {
  title: "",
  imageFiles: null,
  position: "1",
  status: "1",
};

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setError] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const isDarkMode = useMemo(
    () => localStorage.getItem("darkMode") === "true",
    [],
  );

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBannerList();
      if (res.status) {
        setBanners(Array.isArray(res.data?.data) ? res.data.data : []);
      }
    } catch {
      setError("Failed to load banners.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [setBanners]);
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleOpenAddModal = useCallback(() => {
    setIsEditMode(false);
    setSelectedId(null);
    setError(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  }, []);

  const handleEditClick = useCallback((banner) => {
    setIsEditMode(true);
    setSelectedId(banner.id);
    setError(null);
    setFormData({
      title: banner.title,
      imageFiles: null,
      position: String(banner.position),
      status: String(banner.status),
    });
    setIsModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback((banner) => {
    const newStatus = banner.status == 1 ? "0" : "1";

    toast.promise(
      updateBannerStatus(banner.id, {
        status: newStatus,
        title: banner.title,
        position: String(banner.position),
        imageFiles: null,
      }),
      {
        loading: "Updating status...",
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          setBanners((prev) =>
            prev.map((b) =>
              b.id === banner.id ? { ...b, status: parseInt(newStatus) } : b,
            ),
          );
          return `Banner is now ${newStatus == 1 ? "Visible" : "Hidden"}`;
        },
        error: (err) => err.message || "Status update failed.",
      },
      { id: "banner-action" },
    );
  }, []);
  const executeDelete = useCallback(async (id) => {
    const toastId = toast.loading("Deleting banner...", {
      id: "banner-action",
    });

    try {
      const res = await deleteBanner(id);
      if (res.status) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success("Deleted successfully", {
          id: toastId,
          duration: 3000,
        });
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Delete failed", {
        id: toastId,
        duration: 4000,
      });
    }
  }, []);

  const handleDeleteClick = useCallback(
    (id) => {
      toast(
        (t) => (
          <div style={{ padding: "4px", minWidth: "240px" }}>
            <p
              style={{
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: "16px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              DELETE PERMANENTLY?
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  background: "#475569",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  executeDelete(id);
                }}
                style={{
                  background: "#EF4444",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "900",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ),
        {
          id: "delete-confirm",
          duration: Infinity,
          position: "top-center",
        },
      );
    },
    [executeDelete],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.imageFiles && !isEditMode) {
        setError("Please select images.");
        return;
      }

      setIsSubmitting(true);

      const apiCall = isEditMode
        ? updateBannerStatus(selectedId, formData)
        : addBanner(formData);

      toast
        .promise(
          apiCall,
          {
            loading: isEditMode ? "Updating banner..." : "Uploading banner...",
            success: (res) => {
              if (!res.status) throw new Error(res.message);
              setIsModalOpen(false);
              fetchBanners();
              return isEditMode ? "Updated successfully" : "Added successfully";
            },
            error: (err) => err.response?.data?.message || "Operation failed",
          },
          { id: "banner-action" },
        )
        .finally(() => setIsSubmitting(false));
    },
    [formData, isEditMode, selectedId, fetchBanners],
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div
      className={`p-6 space-y-8 min-h-screen font-sans ${
        isDarkMode ? "dark-mode" : "bg-[#FAFAFB]"
      }`}
    >
      <div className="flex justify-between items-center bg-white p-7 rounded-3xl shadow-sm border border-blue-100">
        <div>
          <h2 className="text-2xl font-black">Banner Management</h2>
          <p className="text-blue-500 text-sm font-semibold">
            Home Sliders & Promotions
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-100 px-5 py-3 rounded-2xl font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
          >
            <Plus size={20} /> Add Banner
          </button>
        </div>
      </div>

      {(Array.isArray(banners) ? banners : []).map((banner) => (
        <div
          key={banner.id}
          className="bg-white rounded-3xl flex shadow-sm border"
        >
          <img
            src={banner.image?.[0] || "https://via.placeholder.com/300"}
            className="w-1/3 object-cover"
            alt=""
          />

          <div className="p-6 w-full">
            <h3 className="font-black uppercase">{banner.title}</h3>

            <button
              onClick={() => handleToggleStatus(banner)}
              className="mt-3 text-xs font-bold"
            >
              {banner.status == 1 ? "ACTIVE" : "HIDDEN"}
            </button>

            <div className="flex gap-3 mt-6">
              <button onClick={() => handleEditClick(banner)}>Edit</button>
              <button onClick={() => handleDeleteClick(banner.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl w-full max-w-md"
          >
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="file"
              multiple
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageFiles: e.target.files,
                })
              }
            />

            <button disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? "Loading..." : "Save"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Banners;
