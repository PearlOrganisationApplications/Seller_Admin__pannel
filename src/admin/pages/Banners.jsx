import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; 
import { 
  Plus, Trash2, Edit3, Loader2, X, ToggleLeft, ToggleRight, 
  Upload, AlertCircle, ArrowLeft 
} from "lucide-react";
import { getBannerList, addBanner, deleteBanner, updateBannerStatus } from "../api/bannerManagementApi";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    imageFiles: null,
    position: "1", 
    status: "1"
  });

  const getPositionLabel = (pos) => {
    switch (String(pos)) {
      case "1": return "TOP";
      case "2": return "MID";
      case "3": return "BOTTOM";
      default: return `POS: ${pos}`;
    }
  };

  useEffect(() => { 
    fetchBanners(); 
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getBannerList();
      if (res.status) {
        setBanners(res.data);
      }
    } catch (err) {
      setError("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setError(null);
    setFormData({ title: "", imageFiles: null, position: "1", status: "1" });
    setIsModalOpen(true);
  };

  const handleEditClick = (banner) => {
    setIsEditMode(true);
    setSelectedId(banner.id);
    setError(null);
    setFormData({
      title: banner.title,
      imageFiles: null,
      position: String(banner.position),
      status: String(banner.status)
    });
    setIsModalOpen(true);
  };

  // --- STABLE TOAST ACTIONS ---

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status == 1 ? "0" : "1";
    
    // Using a shared ID 'banner-action' replaces any existing toast
    toast.promise(
      updateBannerStatus(banner.id, {
        status: newStatus,
        title: banner.title,
        position: String(banner.position),
        imageFiles: null 
      }),
      {
        loading: 'Updating status...',
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, status: parseInt(newStatus) } : b));
          return `Banner is now ${newStatus == 1 ? 'Visible' : 'Hidden'}`;
        },
        error: (err) => err.message || "Status toggle failed."
      },
      { id: 'banner-action' }
    );
  };

  const handleDeleteClick = (id) => {
    // We give the confirmation toast its own ID so we can dismiss it explicitly
    toast((t) => (
      <div style={{ padding: '4px', minWidth: '240px' }}>
        <p style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
          DELETE PERMANENTLY?
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ background: '#475569', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }}
            style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), {
      id: 'delete-confirm', // Specific ID for the question
      duration: Infinity,   // Stay until user clicks one of the buttons
      position: 'top-center',
      style: { background: '#0F172A', border: '2px solid #334155', borderRadius: '20px' }
    });
  };

  const executeDelete = async (id) => {
    // SWITCHED TO MANUAL PATTERN: This is more stable than .promise for deletes
    const toastId = toast.loading("Deleting banner...", { id: 'banner-action' });

    try {
      const res = await deleteBanner(id);
      if (res.status) {
        // Update local state first for instant UI response
        setBanners(prev => prev.filter(b => b.id !== id));
        // Force replace the loading toast with success and set a clear duration
        toast.success("Banner removed successfully!", { id: toastId, duration: 3000 });
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Delete failed.", { id: toastId, duration: 4000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageFiles && !isEditMode) {
      setError("Please select images to continue.");
      return;
    }

    setIsSubmitting(true);
    
    toast.promise(
      isEditMode ? updateBannerStatus(selectedId, formData) : addBanner(formData),
      {
        loading: isEditMode ? 'Updating banner...' : 'Uploading new banner...',
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          setIsModalOpen(false);
          fetchBanners(); // Reload list after add/edit
          return isEditMode ? "Updated successfully!" : "Added successfully!";
        },
        error: (err) => err.response?.data?.message || "Operation failed."
      },
      { id: 'banner-action' }
    ).finally(() => setIsSubmitting(false));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-[#FAFAFB] min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-7 rounded-3xl shadow-sm border border-blue-100">
        <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight text-left">Banner Management</h2>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider text-left">Home Sliders & Promotions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-bold hover:bg-gray-200 border border-gray-200">
            <ArrowLeft size={18} strokeWidth={3} /> Back
          </button>
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700">
            <Plus size={20} strokeWidth={3} /> Add New Banner
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl font-bold flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="md:w-5/12 relative h-52 md:h-auto overflow-hidden bg-gray-50">
              <img src={banner.image?.[0] || banner.images?.[0] || "https://via.placeholder.com/300x200"} className="w-full h-full object-cover" alt="banner" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-lg">
                {getPositionLabel(banner.position)}
              </div>
            </div>

            <div className="md:w-7/12 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-800 uppercase truncate text-left">{banner.title}</h3>
                <button onClick={() => handleToggleStatus(banner)} className={`mt-3 flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${banner.status == 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {banner.status == 1 ? <ToggleRight size={16}/> : <ToggleLeft size={16}/>}
                  {banner.status == 1 ? 'Active' : 'Hidden'}
                </button>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => handleEditClick(banner)} className="flex-1 flex justify-center items-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all uppercase">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => handleDeleteClick(banner.id)} className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all uppercase">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{isEditMode ? "Update Details" : "Upload Banner"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>
            {error && <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 block text-left">Banner Title</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-medium" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Enter name..." />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 block text-left">Images</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-all mt-1">
                  <Upload className="text-gray-300" size={32} />
                  <span className="text-xs text-gray-400 font-bold mt-2">{formData.imageFiles ? `${formData.imageFiles.length} images selected` : "Click to upload"}</span>
                  <input multiple type="file" accept="image/*" className="hidden" onChange={(e) => setFormData({...formData, imageFiles: e.target.files})} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Position</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-700" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})}>
                    <option value="1">1 - Top</option><option value="2">2 - Mid</option><option value="3">3 - Bottom</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-700" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="1">Active</option><option value="0">Hidden</option>
                  </select>
                </div>
              </div>
              <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase flex justify-center items-center gap-2 hover:bg-blue-700 shadow-xl transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;