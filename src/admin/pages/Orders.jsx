import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Truck,
  X,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { orderApi } from "../api/orderApi";
import { BASE_URL } from "../api/axios";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-emerald-100 text-emerald-700",
  returned: "bg-purple-100 text-purple-700",
  refunded: "bg-purple-100 text-purple-700",
  default: "bg-gray-100 text-gray-700",
};

const getStatusStyle = (status) =>
  STATUS_STYLES[(status || "").toLowerCase()] || STATUS_STYLES.default;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = useCallback(async (status) => {
    setLoading(true);
    try {
      let response;
      switch (status) {
        case "Today":
          response = await orderApi.getTodayOrders();
          break;
        case "Cancelled":
          response = await orderApi.getCancelledOrders();
          break;
        case "Returns":
          response = await orderApi.getReturnOrders();
          break;
        case "Confirmed":
          response = await orderApi.getConfirmedOrders();
          break;
        case "All":
          response = await orderApi.getAllOrders();
          break;
        case "Pending":
        default:
          response = await orderApi.getPendingOrders();
          break;
      }

      if (response.data.status) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(filterStatus);
  }, [filterStatus, fetchOrders]);

  const handleSeeOrder = async (orderId) => {
    try {
      const res = await orderApi.getOrderSee(orderId);
      if (res.data.status) setSelectedOrder(res.data.data);
    } catch {
      alert("Error fetching details");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      (o.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.buyer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filters = [
    { label: "Today's Orders", status: "Today" },
    { label: "All Orders", status: "All" },
    { label: "Pending", status: "Pending" },
    { label: "Confirmed", status: "Confirmed" },
    { label: "Cancelled", status: "Cancelled" },
    { label: "Returns", status: "Returns" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShoppingBag className="text-white" size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Order Management
            </h2>
            <p className="text-sm text-gray-500">
              {loading
                ? `Fetching ${filterStatus} orders...`
                : `${filteredOrders.length} order${filteredOrders.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Buyer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((box) => (
          <button
            key={box.status}
            onClick={() => setFilterStatus(box.status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filterStatus === box.status
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-200"
                : "bg-white/70 backdrop-blur-md text-gray-600 border-white/60 hover:bg-white"
            }`}
          >
            {box.label}
          </button>
        ))}
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
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Order ID</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Date</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Amount</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Buyer Id</th>
                  <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Product Id</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 text-center font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/40 hover:bg-white/60 hover:shadow-md transition-all duration-200"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-800">{o.order_id}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleString().split(",")[0]
                          : "N/A"}
                      </td>
                      <td className="px-5 py-4 text-gray-700 font-medium">₹{o.total_amount}</td>
                      <td className="px-5 py-4 text-gray-600">{o.user_id || o.buyer?.id || "N/A"}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {o.order_items
                          ? o.order_items.map((item) => item.product_id).join(", ")
                          : o.products
                            ? o.products.map((p) => p.product_id).join(", ")
                            : "N/A"}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSeeOrder(o.order_id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-300/40 hover:bg-indigo-500/20 transition-all text-xs font-medium"
                          >
                            <Eye size={13} /> See
                          </button>
                          <button
                            onClick={() => navigate("/admin/order-tracking")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-300/40 hover:bg-emerald-500/20 transition-all text-xs font-medium"
                          >
                            <Truck size={13} /> Track
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-14 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <PackageSearch size={28} className="text-gray-300" />
                        No {filterStatus} orders found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-700 to-purple-600 text-white shrink-0">
              <h3 className="text-lg font-bold">Order: {selectedOrder.order_id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Buyer Name</p>
                  <p className="text-sm font-medium text-gray-800 mb-3">{selectedOrder.buyer?.name || "N/A"}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Buyer Phone</p>
                  <p className="text-sm font-medium text-gray-800">{selectedOrder.buyer?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Payment Amount</p>
                  <p className="text-lg font-bold text-indigo-700 mb-3">₹{selectedOrder.total_amount}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Order Status</p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Ordered Products</p>
                <div className="space-y-2">
                  {selectedOrder.products?.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm text-gray-700">
                        {p.name} <span className="text-gray-400">x{p.quantity}</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-800">₹{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.return_details && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                  <p className="text-xs font-semibold text-red-600 uppercase mb-2">Return Details</p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Reason:</span> {selectedOrder.return_details.reason}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-2">
                    <span className="font-semibold">Return Status:</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {selectedOrder.return_details.status}
                    </span>
                  </p>
                  {selectedOrder.return_details.product_image && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Return Proof Image</p>
                      <img
                        src={`${BASE_URL}${selectedOrder.return_details.product_image}`}
                        alt="Product Return"
                        className="w-full max-w-[200px] rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}