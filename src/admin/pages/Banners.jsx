import React, { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Link as LinkIcon, 
  Calendar,
  Loader2,
  AlertCircle,
  X // Added for closing modal
} from "lucide-react";
import { getBannerList, addBanner } from "../api/bannerManagementApi"; // Import addBanner

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- New State for Modal and Form ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "", // We'll convert this to an array images[] on submit
    position: 1,
    status: 1
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBannerList();
      if (response.status) {
        setBanners(response.data);
      } else {
        setError("Could not retrieve banner data.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        "images[]": [formData.imageUrl], // Matching your API param requirement
        position: Number(formData.position),
        status: Number(formData.status)
      };

      const res = await addBanner(payload);
      if (res.status) {
        setIsModalOpen(false);
        setFormData({ title: "", imageUrl: "", position: 1, status: 1 });
        fetchBanners(); // Refresh list
      } else {
        alert(res.message || "Failed to add banner");
      }
    } catch (err) {
      alert("Error submitting banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#632281] mb-4" size={48} />
        <p className="text-[#632281] font-bold animate-pulse text-lg tracking-tight">Syncing Banners...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-[#FAFAFB] min-h-screen relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-7 rounded-3xl shadow-sm border border-purple-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Banner Management</h2>
          <p className="text-purple-500 text-sm font-semibold">Displaying all active homepage sliders</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} // Open Modal
          className="flex items-center justify-center gap-2 bg-[#632281] text-white px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-100 hover:bg-[#4a1961] transition-all font-bold active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Create New Banner</span>
        </button>
      </div>

      {/* --- ADD BANNER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">Add New Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Banner Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="e.g. Top Sale Banner"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Image URL</label>
                <input 
                  required
                  type="url" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Position</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Status</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#632281] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4a1961] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Banner"}
              </button>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl font-bold flex items-center gap-4">
          <AlertCircle size={24} /> 
          <div>
             <p>Error Encountered</p>
             <p className="text-sm font-medium opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Grid Layout (Existing) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500">
            {/* Visuals... */}
            <div className="md:w-5/12 relative h-60 md:h-auto overflow-hidden">
              <img 
                src={banner.image?.[0] || 'https://via.placeholder.com/400'} 
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-5 left-5">
                <span className="bg-[#632281] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  POS: {banner.position}
                </span>
              </div>
            </div>

            <div className="md:w-7/12 p-8 flex flex-col">
              <h3 className="text-xl font-black text-gray-800 mb-1">{banner.title}</h3>
              <div className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${banner.status === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {banner.status === 1 ? '• Active' : '• Hidden'}
              </div>
              
              {/* Other Info... */}
              <div className="mt-6 flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-[#632281] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#632281] hover:text-white transition-all">
                  <Edit3 size={14} /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;