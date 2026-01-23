import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/Sellers.css";
import { getSellers, deleteSellerById } from "../api/sellerApi"; // Path to your new api file

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch Sellers using Axios Service
  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await getSellers();
      if (data.status && data.sellers) {
        const formatted = data.sellers.map((s) => ({
          id: s.id,
          name: s.name || "N/A",
          type: s.business_type || "N/A",
          gender: s.gender || "N/A",
          mobile: s.phone || "N/A",
          email: s.email || "N/A",
          address: s.address || "N/A",
          status: s.status === "1" ? "Active" : "Inactive",
        }));
        setSellers(formatted);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Filter Logic
  const filteredSellers = sellers.filter((s) => {
    const text = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(text) ||
      s.type.toLowerCase().includes(text) ||
      s.mobile.toLowerCase().includes(text) ||
      s.email.toLowerCase().includes(text) ||
      s.id.toString().includes(text)
    );
  });

  // Delete Seller using Axios Service
  const deleteSeller = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    
    try {
      const data = await deleteSellerById(id);
      if (data.status) {
        alert("Seller deleted successfully");
        setSellers((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the seller.");
    }
  };

  const viewListedProducts = (id) => alert(`Listed products for ID: ${id}`);
  const viewOrderManagement = (id) => alert(`Order management for ID: ${id}`);
  const viewPendingRequests = (id) => alert(`Pending requests for ID: ${id}`);

  return (
    <div className="sellers-page-container">
      <div className="header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="page-title">Seller Management</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search sellers by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading sellers...</p>
      ) : (
        <div className="table-responsive">
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Seller ID</th>
                <th>Name</th>
                <th>Business Type</th>
                <th>Mob. No.</th>
                <th>Email</th>
                <th>Status</th>
                <th>Products</th>
                <th>Orders</th>
                <th>Requests</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="font-bold">{s.name}</td>
                    <td>{s.type}</td>
                    <td>{s.mobile}</td>
                    <td>{s.email}</td>
                    <td>
                      <span className={`status-pill ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td><button className="btn view" onClick={() => viewListedProducts(s.id)}>View</button></td>
                    <td><button className="btn view" onClick={() => viewOrderManagement(s.id)}>View</button></td>
                    <td><button className="btn view" onClick={() => viewPendingRequests(s.id)}>View</button></td>
                    <td><button className="btn delete" onClick={() => deleteSeller(s.id)}>Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>No sellers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}