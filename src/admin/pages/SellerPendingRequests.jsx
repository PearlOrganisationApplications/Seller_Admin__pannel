import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerPendingOrders } from "../api/sellerApi";

export default function SellerPendingRequests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSellerPendingOrders(id);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
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
      Pending Requests
    </h1>

    <p
      style={{
        color: "#8A8FA3",
        fontSize: "16px",
        marginTop: "6px",
      }}
    >
      View and manage seller pending requests
    </p>
  </div>
</div>

      {loading ? <p className="loading-text">Loading Pending Requests...</p> : (
        <div className="table-responsive">
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Products</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td>₹{o.total_amount}</td>
                  <td>
                     {o.order_items.map(item => (
                      <div key={item.id}>{item.product?.name}</div>
                    ))}
                  </td>
                  <td style={{maxWidth: '200px', fontSize: '12px'}}>{o.address}</td>
                  <td>
                    <span className="status-pill pending">{o.status}</span>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" style={{textAlign: 'center'}}>No pending requests</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}