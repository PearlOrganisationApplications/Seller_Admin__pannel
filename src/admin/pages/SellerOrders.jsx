import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerOrders } from "../api/sellerApi";

export default function SellerOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSellerOrders(id);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="sellers-page-container">
  <div
  className="header-container"
  style={{
    position: "relative",
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px 0",
  }}
>
  <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      left: "0",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#fff",
      background: "#000",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    }}
  >
    ←
  </button>

  <div>
    <h1
      style={{
        fontSize: "38px",
        fontWeight: "800",
        color: "#3B45F6",
        margin: 0,
        lineHeight: "1.2",
      }}
    >
      Order Management
    </h1>

    <p
      style={{
        color: "#8A8FA3",
        fontSize: "16px",
        marginTop: "6px",
      }}
    >
      View and manage seller orders
    </p>
  </div>
</div>

      {loading ? <p className="loading-text">Loading Orders...</p> : (
        <div className="table-responsive">
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Amount</th>
                <th>Items (Qty)</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td className="font-bold">₹{o.total_amount}</td>
                  <td>
                    {o.order_items.map(item => (
                      <div key={item.id} style={{fontSize: '12px'}}>
                        • {item.product?.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td><span className="status-pill info">{o.payment_status}</span></td>
                  <td>
                    <span className={`status-pill ${o.status}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              )) : <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}