import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/Users.css";
import {
  getCustomers,
  deleteCustomerApi,
  getUserOrderHistory,
  getUserReturnHistory
} from "../api/userApi";
import { BASE_URL } from "../api/axios"; // To show return images

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // History Modal States
  const [historyData, setHistoryData] = useState(null);
  const [historyType, setHistoryType] = useState(null); // 'orders' or 'returns'
  const [historyLoading, setHistoryLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
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

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const data = await deleteCustomerApi(id);
      if (data.status) {
        alert("User deleted successfully");
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  // Fetch Order History
  const viewOrderHistory = async (userId) => {
    setHistoryLoading(true);
    setHistoryType('orders');
    try {
      const data = await getUserOrderHistory(userId);
      if (data.status) setHistoryData(data.delivered_orders);
    } catch (err) {
      alert("Error loading order history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch Return History
  const viewReturnHistory = async (userId) => {
    setHistoryLoading(true);
    setHistoryType('returns');
    try {
      const data = await getUserReturnHistory(userId);
      if (data.status) setHistoryData(data.return_history);
    } catch (err) {
      alert("Error loading return history");
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
    return u.name.toLowerCase().includes(text) || u.mobile.includes(text) || u.id.toString().includes(text);
  });

  return (
    <div className="users-page-container">
      <div className="header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="page-title">Customer Management</h2>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search by Name, ID, or Phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Mob. No.</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Address</th>
                <th>Search History</th>
                <th>Return History</th>
                <th>Order History</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td className="font-bold">{u.name}</td>
                  <td>{u.dob}</td>
                  <td>{u.mobile}</td>
                  <td>{u.gender}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td><button className="btn save" onClick={() => viewSearchHistory(u.id)}>Search</button></td>
                  <td><button className="btn save" onClick={() => viewReturnHistory(u.id)}>Returns</button></td>
                  <td><button className="btn save" onClick={() => viewOrderHistory(u.id)}>Orders</button></td>
                  <td><button className="btn delete" onClick={() => deleteUser(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- HISTORY MODAL --- */}
      {(historyType || historyLoading) && (
        <div className="modal-overlay" onClick={closeHistory}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{historyType === 'orders' ? 'Order History' : 'Return History'}</h3>
              <button className="close-btn" onClick={closeHistory}>×</button>
            </div>

            <div className="modal-body">
              {historyLoading ? (
                <p>Loading details...</p>
              ) : historyData && historyData.length > 0 ? (
                <div className="history-list">
                  {historyType === 'orders' ? (
                    historyData.map((order, idx) => (
                      <div key={idx} className="history-item">
                        <p><strong>ID:</strong> {order.order_id}</p>
                        <p><strong>Amount:</strong> ₹{order.total_amount}</p>
                        <p><strong>Status:</strong> <span className="status-badge">{order.status}</span></p>
                        <p className="date-text">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    historyData.map((ret, idx) => (
                      <div key={idx} className="history-item return-item">
                        <img src={`${BASE_URL}${ret.product_image}`} alt="Return" className="return-thumb" />
                        <div className="return-info">
                          <p><strong>Order:</strong> {ret.order_id}</p>
                          <p><strong>Reason:</strong> {ret.reason}</p>
                          <p><strong>Status:</strong> <span className={`status-badge ${ret.status}`}>{ret.status}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="no-data">No history found for this user.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}