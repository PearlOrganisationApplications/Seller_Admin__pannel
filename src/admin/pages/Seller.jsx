import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  Package,
  ClipboardList,
  Clock,
  Store,
} from "lucide-react";
import { getSellers, deleteSellerById, toggleSellerStatus } from "../api/sellerApi";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await getSellers();
      if (data.status && data.sellers) {
    const formatted = data.sellers.map((s) => ({
  id: s.id,
  name: s.name || "N/A",
  type: s.business_type || "N/A",
  mobile: s.phone || "N/A",
  email: s.email || "N/A",
  address: s.address || "N/A",
  gender: s.gender || "N/A",
  statusValue: s.status,
  status: s.status === "1" ? "Active" : "Inactive",
}));
        setSellers(formatted);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
      toast.error("Failed to load sellers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleToggleStatus = async (id) => {
    const loadingToast = toast.loading("Updating status...");

    try {
      const data = await toggleSellerStatus(id);
      if (data.status) {
        setSellers((prevSellers) =>
          prevSellers.map((s) => {
            if (s.id === id) {
              const newStatusValue = String(data.seller.status);
              return {
                ...s,
                statusValue: newStatusValue,
                status: newStatusValue === "1" ? "Active" : "Inactive",
              };
            }
            return s;
          })
        );
        toast.success(data.message || "Status updated successfully", { id: loadingToast });
      } else {
        toast.error(data.message || "Failed to update status", { id: loadingToast });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("An error occurred while updating status", { id: loadingToast });
    }
  };

  const deleteSeller = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this seller?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting seller...");

    try {
      const data = await deleteSellerById(id);
      if (data.status === true || data.message?.toLowerCase().includes("success")) {
        toast.success("Seller deleted successfully", { id: loadingToast });
        setSellers((prevSellers) => prevSellers.filter((s) => s.id !== id));
      } else {
        toast.error(data.message || "Failed to delete seller", { id: loadingToast });
      }
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage = err.response?.data?.message || "An error occurred during deletion";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const text = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(text) ||
      s.email.toLowerCase().includes(text) ||
      s.id.toString().includes(text)
    );
  });

  const viewListedProducts = (id) => navigate(`/admin/seller/products/${id}`);
  const viewOrderManagement = (id) => navigate(`/admin/seller/orders/${id}`);
  const viewPendingRequests = (id) => navigate(`/admin/seller/pending-requests/${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Store className="text-white" size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Seller Management
            </h2>
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading sellers..."
                : `${filteredSellers.length} seller${filteredSellers.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search sellers by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Seller ID</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Name</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Business Type</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Mob. No.</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Email</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Products</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Orders</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Requests</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSellers.length > 0 ? (
                  filteredSellers.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/40 hover:bg-white/60 hover:shadow-md transition-all duration-200"
                    >
                      <td className="px-5 py-4 text-gray-600">{s.id}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{s.name}</td>
                      <td className="px-5 py-4 text-gray-600">{s.type}</td>
                      <td className="px-5 py-4 text-gray-600">{s.mobile}</td>
                      <td className="px-5 py-4 text-gray-600">{s.email}</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          title="Click to toggle status"
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            s.status === "Active"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {s.status}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewListedProducts(s.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-300/40 hover:bg-blue-500/20 transition-all text-xs font-medium"
                        >
                          <Package size={13} /> View
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewOrderManagement(s.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-300/40 hover:bg-emerald-500/20 transition-all text-xs font-medium"
                        >
                          <ClipboardList size={13} /> View
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewPendingRequests(s.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300/40 hover:bg-amber-500/20 transition-all text-xs font-medium"
                        >
                          <Clock size={13} /> View
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => deleteSeller(s.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 border border-red-300/40 hover:bg-red-500 hover:text-white transition-all text-xs font-medium"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-14 text-gray-400">
                      No sellers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}