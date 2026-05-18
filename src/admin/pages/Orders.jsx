import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { BASE_URL } from "../api/axios";
import "./BarChart/Orders.css";

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
      // Based on your JSON, the data is inside res.data.data
      if (res.data.status) setSelectedOrder(res.data.data);
    } catch {
      alert("Error fetching details");
    }
  };

  // Filter local state based on Search Term (Updated to buyer.name)
  const filteredOrders = orders.filter(
    (o) =>
      (o.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.buyer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="orders-page-container">
      <div className="header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="page-title">Order Management</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Order ID or Buyer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-container">
        {[
          { label: "Today's Orders", status: "Today" },
          { label: "All Orders", status: "All" },
          { label: "Pending", status: "Pending" },
          { label: "Confirmed", status: "Confirmed" },
          { label: "Cancelled", status: "Cancelled" },
          { label: "Returns", status: "Returns" },
        ].map((box) => (
          <button
            key={box.status}
            className={`filter-box ${filterStatus === box.status ? "selected" : ""}`}
            onClick={() => setFilterStatus(box.status)}
          >
            {box.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-container">
          <p className="loading-text">Fetching {filterStatus} orders...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Buyer Id</th>
                <th>Product Id</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o, i) => (
                  <tr key={i}>
                    <td>{o.order_id}</td>
                    <td>
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString().split(",")[0]
                        : "N/A"}
                    </td>
                    <td>₹{o.total_amount}</td>
                    <td>{o.user_id || o.buyer?.id || "N/A"}</td>
                    <td>
                      {o.order_items
                        ? o.order_items
                            .map((item) => item.product_id)
                            .join(", ")
                        : o.products
                          ? o.products.map((p) => p.product_id).join(", ")
                          : "N/A"}
                    </td>
                    <td>
                      <span className={`status-tag ${o.status?.toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn save"
                        onClick={() => handleSeeOrder(o.order_id)}
                      >
                        See
                      </button>
                      <button
                        className="btn manage"
                        onClick={() => navigate("/admin/order-tracking")}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No {filterStatus} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order: {selectedOrder.order_id}</h3>
              <button
                className="close-x"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="info-grid">
                <div>
                  <p className="label">Buyer Name</p>
                  <p className="val">{selectedOrder.buyer?.name || "N/A"}</p>
                  <p className="label">Buyer Phone</p>
                  <p className="val">{selectedOrder.buyer?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="label">Payment Amount</p>
                  <p className="val highlight">₹{selectedOrder.total_amount}</p>
                  <p className="label">Order Status</p>
                  <p className={`status-tag ${selectedOrder.status}`}>
                    {selectedOrder.status}
                  </p>
                </div>
              </div>

              <div className="product-section">
                <p className="label">Ordered Products</p>
                {selectedOrder.products?.map((p, idx) => (
                  <div key={idx} className="product-row">
                    <span>
                      {p.name} <small>x{p.quantity}</small>
                    </span>
                    <span>₹{p.price}</span>
                  </div>
                ))}
              </div>

              {selectedOrder.return_details && (
                <div
                  className="return-box"
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#fff5f5",
                    borderRadius: "8px",
                    border: "1px solid #fed7d7",
                  }}
                >
                  <p className="label" style={{ color: "#c53030" }}>
                    Return Details
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {selectedOrder.return_details.reason}
                  </p>
                  <p>
                    <strong>Return Status:</strong>{" "}
                    <span className="status-tag refunded">
                      {selectedOrder.return_details.status}
                    </span>
                  </p>
                  {selectedOrder.return_details.product_image && (
                    <div style={{ marginTop: "10px" }}>
                      <p className="label">Return Proof Image:</p>
                      <img
                        src={`${BASE_URL}${selectedOrder.return_details.product_image}`}
                        alt="Product Return"
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
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
