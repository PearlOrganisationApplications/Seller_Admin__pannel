import { useEffect, useState } from "react";
// ❌ REMOVE: import AdminLayout from "../layouts/AdminLayout";
import "./BarChart/Orders.css";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.slice(0, 5).map((o, i) => ({
          id: "E2454" + i,
          date: "29-10-2020",
          customer: ["Binod", "Vineet", "Ajay", "Alankhe", "Arjun"][i],
          amount: 600,
          status: ["Out for delivery", "Shipped", "Confirmed", "Processing", "Out for delivery"][i],
          exp: "30-10-2020",
          buyerId: "5054M",
          sellerId: "60234M",
          productId: "85034M",
        }));
        setOrders(formatted);
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders
    .filter((o) =>
      Object.values(o).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((o) => {
      if (!filterStatus) return true;
      if (filterStatus === "Pending") return o.status === "Out for delivery";
      if (filterStatus === "Cancelled") return o.status === "Cancelled";
      if (filterStatus === "Processing") return o.status === "Processing";
      if (filterStatus === "New") return o.status === "Confirmed";
      return true;
    });

  return (
    // ✅ CHANGE: Use a simple div, NOT AdminLayout
    <div className="orders-page-container">
      <h2 className="page-title">Order Management</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="container">
        {[
          { label: "Pending Orders", status: "Pending" },
          { label: "Cancelled Orders", status: "Cancelled" },
          { label: "Processing Orders", status: "Processing" },
          { label: "New Orders", status: "New" },
          { label: "All Orders", status: "" },
        ].map((box) => (
          <button
            key={box.status || "all"}
            className={`box ${filterStatus === box.status ? "selected" : ""}`}
            onClick={() => setFilterStatus(box.status)}
          >
            {box.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#666", textAlign: "center" }}>Loading orders...</p>
      ) : (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Dispatch</th>
                <th>Buyer ID</th>
                <th>Seller ID</th>
                <th>Product ID</th>
                <th>Order Details</th>
                <th>Order Tracking</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => (
                <tr key={i}>
                  <td>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.customer}</td>
                  <td>{o.amount}</td>
                  <td><span className="status-tag">{o.status}</span></td>
                  <td>{o.exp}</td>
                  <td>{o.buyerId}</td>
                  <td>{o.sellerId}</td>
                  <td>{o.productId}</td>
                  <td><button className="btn save">See</button></td>
                  <td><button className="btn manage" onClick={() => navigate("/admin/order-tracking")} >Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}