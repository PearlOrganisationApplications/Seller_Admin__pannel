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
  baner_type: "offer",
  imageFiles: [],
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
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
  const isDarkMode = useMemo(
    () => localStorage.getItem("darkMode") === "true",
    [],
  );

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBannerList();
     if (res.status) {
  setBanners(Array.isArray(res.bannerData?.data) ? res.bannerData.data : []);
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
    position: String(banner.position),
    status: banner.status == 1 ? "true" : "false", // ✅ fix
    imageFiles: null,
  });
  setIsModalOpen(true);
}, []);

  const handleToggleStatus = useCallback((banner) => {
    const newStatus = banner.status == 1 ? false : true;

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

const handleDeleteClick = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.imageFiles.length === 0 && !isEditMode) {
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
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
          >
            <Plus size={20} /> Add Banner
          </button>
        </div>
      </div>

      {Array.isArray(banners) && (
   <div className="bg-white rounded-2xl shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-4 text-left">Image</th>
        <th className="p-4 text-left">Title</th>
        <th className="p-4 text-center">Position</th>
        <th className="p-4 text-center">Status</th>
        <th className="p-4 text-center">Action</th>
      </tr>
    </thead>

    <tbody>
      {banners.map((banner) => (
        <tr key={banner.id} className="border-t">
          <td className="p-4">
            <img
              src={banner.image?.[0]}
              alt=""
              className="w-24 h-16 rounded-lg object-cover"
            />
          </td>

          <td className="p-4 font-semibold">
            {banner.title}
          </td>

          <td className="p-4 text-center">
            {banner.position}
          </td>

          <td className="p-4 text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs text-white ${
                banner.status ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {banner.status ? "Active" : "Inactive"}
            </span>
          </td>

          <td className="p-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEditClick(banner)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                <Edit3 size={16} />
              </button>

              <button
                onClick={() => handleDeleteClick(banner.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
         <form
  onSubmit={handleSubmit}
  className="relative bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[28px] w-full max-w-xl overflow-hidden animate-[fadeIn_.3s_ease]"
>
           {/* Header */}
<div className="bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-6 text-white flex justify-between items-center">
  <div>
    <h2 className="text-2xl font-bold">
      {isEditMode ? "Edit Banner" : "Add Banner"}
    </h2>
    <p className="text-sm text-blue-100">
      Upload promotional banner
    </p>
  </div>

  <button
    type="button"
    onClick={() => setIsModalOpen(false)}
    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
  >
    <X size={20} />
  </button>
</div>

<div className="p-8 space-y-5">

  <div>
    <label className="block mb-2 font-semibold">Banner Title</label>

    <input
      value={formData.title}
      onChange={(e) =>
        setFormData({ ...formData, title: e.target.value })
      }
      placeholder="Enter Banner Title"
      className="w-full p-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
    />
  </div>

<div>
  <label className="block mb-2 font-semibold">
    Banner Type
  </label>

  <select
    value={formData.baner_type}
    onChange={(e) =>
      setFormData({
        ...formData,
        baner_type: e.target.value,
      })
    }
    className="w-full p-4 rounded-2xl border border-slate-200"
  >
    <option value="offer">Offer</option>
    <option value="slider">Slider</option>
    <option value="home">Home</option>
  </select>
</div>

<div>
  <label className="block mb-2 font-semibold">
    Status
  </label>

  <select
    value={String(formData.status)}
    onChange={(e) =>
      setFormData({
        ...formData,
        status: e.target.value === "true",
      })
    }
    className="w-full p-4 rounded-2xl border border-slate-200"
  >
    <option value="true">Active</option>
    <option value="false">Inactive</option>
  </select>
</div>
  <div>
    <label className="block mb-2 font-semibold">Upload Banner</label>

    <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition">

      <Upload size={40} className="text-blue-600 mb-3" />

      <p className="font-semibold">
        Click to Upload
      </p>

      <span className="text-sm text-slate-500">
        PNG, JPG, WEBP
      </span>

     <input
  type="file"
  multiple
  accept="image/*"
  hidden
  onChange={(e) =>
    setFormData({
      ...formData,
      imageFiles: [...e.target.files],
    })
  }
/>{formData.imageFiles?.length > 0 && (
  <p className="mt-2 text-sm text-green-600">
    {formData.imageFiles.length} image(s) selected
  </p>
)}
    </label>
  </div>

  <div className="flex justify-end gap-3 pt-3">

    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
    >
      Cancel
    </button>

    <button
      disabled={isSubmitting}
      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-lg hover:scale-105 transition"
    >
      {isSubmitting ? "Saving..." : "Save Banner"}
    </button>

  </div>

</div>
          </form>
        </div>
      )}
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[380px] shadow-2xl">
      <h2 className="text-xl font-bold text-center">
        Delete Banner?
      </h2>

      <p className="text-gray-500 text-center mt-2">
        Are you sure you want to delete this banner?
      </p>

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-5 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            executeDelete(deleteId);
            setShowDeleteModal(false);
          }}
          className="px-5 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Banners;
