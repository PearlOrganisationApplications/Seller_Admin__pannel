import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 1. Import toast
import "./BarChart/Sellers.css";
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
          gender: s.gender || "N/A",
          mobile: s.phone || "N/A",
          email: s.email || "N/A",
          address: s.address || "N/A",
          statusValue: String(s.status),
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

  // --- Toggle Status with Toast ---
  const handleToggleStatus = async (id) => {
    // Optional: Show a loading toast while the API works
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
        // Replace alert with toast.success
        toast.success(data.message || "Status updated successfully", { id: loadingToast });
      } else {
        toast.error(data.message || "Failed to update status", { id: loadingToast });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("An error occurred while updating status", { id: loadingToast });
    }
  };

  // --- Delete Seller with Toast ---
  const deleteSeller = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this seller?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting seller...");

    try {
      const data = await deleteSellerById(id);
      if (data.status === true || data.message?.toLowerCase().includes("success")) {
        // Replace alert with toast.success
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
    <div className="sellers-page-container">
      <div className="header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
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
                <th>Status (Click to toggle)</th>
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
                      <span
                        className={`status-pill ${s.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(s.id)}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle status"
                      >
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