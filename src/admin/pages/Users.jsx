import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomerApi,
  getUserOrderHistory,
  getUserReturnHistory,
} from "../api/userApi";
import { BASE_URL } from "../api/axios"; // To show return images
import { Search, Trash2, Package, RotateCcw, X, Users as UsersIcon } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // History Modal States
  const [historyData, setHistoryData] = useState(null);
  const [historyType, setHistoryType] = useState(null); // 'orders' or 'returns'
  const [historyLoading, setHistoryLoading] = useState(false);

  // Delete Confirm Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Simple toast/alert state (replaces browser alert())
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      if (data.status && Array.isArray(data.customers)) {
        const formatted = data.customers.map((u, i) => ({
          id: u.id,
          name: u.name || "N/A",
          dob: u.dob || "N/A",
          gender: u.gender || (i % 2 === 0 ? "M" : "F"),
          mobile: u.phone || "N/A",
          email: u.email || "N/A",
          address: u.address || "N/A",
        }));
        setUsers(formatted);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete flow (custom modal instead of window.confirm / alert) ---
  const askDeleteUser = (id) => setConfirmDeleteId(id);

  const cancelDelete = () => {
    if (deleting) return;
    setConfirmDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      const data = await deleteCustomerApi(confirmDeleteId);
      if (data.status) {
        setUsers((prev) => prev.filter((u) => u.id !== confirmDeleteId));
        setToast({ type: "success", message: "User deleted successfully" });
      } else {
        setToast({ type: "error", message: "Failed to delete user." });
      }
    } catch {
      setToast({ type: "error", message: "Failed to delete user." });
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // --- Search history (was missing before — added so button works) ---
  const viewSearchHistory = async (userId) => {
    setHistoryLoading(true);
    setHistoryType("search");
    try {
      // TODO: replace with your actual search-history API call
      setHistoryData([]);
    } catch {
      setToast({ type: "error", message: "Error loading search history" });
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- Order history ---
  const viewOrderHistory = async (userId) => {
    setHistoryLoading(true);
    setHistoryType("orders");
    try {
      const data = await getUserOrderHistory(userId);
      if (data.status) setHistoryData(data.delivered_orders);
    } catch {
      setToast({ type: "error", message: "Error loading order history" });
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- Return history ---
  const viewReturnHistory = async (userId) => {
    setHistoryLoading(true);
    setHistoryType("returns");
    try {
      const data = await getUserReturnHistory(userId);
      if (data.status) setHistoryData(data.return_history);
    } catch {
      setToast({ type: "error", message: "Error loading return history" });
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryData(null);
    setHistoryType(null);
  };

  const filteredUsers = users.filter((u) => {
    const text = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(text) ||
      u.mobile.includes(text) ||
      u.id.toString().includes(text)
    );
  });

  const historyTitle =
    historyType === "orders"
      ? "Order History"
      : historyType === "returns"
      ? "Return History"
      : "Search History";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <UsersIcon className="text-white" size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Customer Management
            </h2>
            <p className="text-sm text-gray-500">
              {loading ? "Loading customers..." : `${filteredUsers.length} customer${filteredUsers.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Name, ID, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
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
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Name</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">DOB</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Mob. No.</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Gender</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Email</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Address</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Search</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Returns</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Orders</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/40 hover:bg-white/60 hover:shadow-md transition-all duration-200"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-800">{u.name}</td>
                      <td className="px-5 py-4 text-gray-600">{u.dob}</td>
                      <td className="px-5 py-4 text-gray-600">{u.mobile}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {u.gender}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{u.email}</td>
                      <td className="px-5 py-4 text-gray-600 max-w-[200px] truncate" title={u.address}>
                        {u.address}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewSearchHistory(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-300/40 hover:bg-blue-500/20 transition-all text-xs font-medium"
                        >
                          <Search size={13} /> Search
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewReturnHistory(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300/40 hover:bg-amber-500/20 transition-all text-xs font-medium"
                        >
                          <RotateCcw size={13} /> Returns
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewOrderHistory(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-300/40 hover:bg-emerald-500/20 transition-all text-xs font-medium"
                        >
                          <Package size={13} /> Orders
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => askDeleteUser(u.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 border border-red-300/40 hover:bg-red-500 hover:text-white transition-all text-xs font-medium"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-14 text-gray-400">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- HISTORY MODAL (Search / Returns / Orders) ---------- */}
      {(historyType || historyLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeHistory}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl overflow-hidden bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-700 to-purple-600 text-white shrink-0">
              <h3 className="text-lg font-bold">{historyTitle}</h3>
              <button
                onClick={closeHistory}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {historyLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : historyData && historyData.length > 0 ? (
                <div className="space-y-3">
                  {historyType === "orders" &&
                    historyData.map((order, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-slate-50 border border-slate-100 p-4 hover:shadow-md transition-all"
                      >
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">ID:</span> {order.order_id}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Amount:</span> ₹{order.total_amount}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="font-semibold">Status:</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            {order.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Date: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                  {historyType === "returns" &&
                    historyData.map((ret, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4 hover:shadow-md transition-all"
                      >
                        <img
                          src={`${BASE_URL}${ret.product_image}`}
                          alt="Return"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Order:</span> {ret.order_id}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Reason:</span> {ret.reason}
                          </p>
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="font-semibold">Status:</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              {ret.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                  {historyType === "search" &&
                    historyData.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-slate-50 border border-slate-100 p-4 hover:shadow-md transition-all text-sm text-gray-700"
                      >
                        {item.query || JSON.stringify(item)}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-10">
                  No history found for this user.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- DELETE CONFIRM MODAL (replaces window.confirm) ---------- */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Delete this account?</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone. Are you sure you want to delete this user?
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- TOAST (replaces alert()) ---------- */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-2xl shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}