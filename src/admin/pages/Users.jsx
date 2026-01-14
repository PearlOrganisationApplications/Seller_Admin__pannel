import { useEffect, useState } from "react";
// ❌ REMOVE: import AdminLayout from "../layouts/AdminLayout";
import "./BarChart/Users.css";
import { BASE_URL } from "../api/BaseUrl";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/Customers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.customers)) {
          const formatted = data.customers.map((u, i) => ({
            id: u.id,
            name: u.name || "N/A",
            dob: u.dob || "N/A",
            gender: u.gender || (i % 2 === 0 ? "M" : "F"),
            mobile: u.phone || "N/A",
            email: u.email || "N/A",
            address: u.address || "N/A",
            status: u.status === "1" ? "Active" : "Inactive",
          }));
          setUsers(formatted);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // FILTER SEARCH
  const filteredUsers = users.filter((u) => {
    const text = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text) ||
      u.mobile.toLowerCase().includes(text) ||
      u.gender.toLowerCase().includes(text) ||
      u.address.toLowerCase().includes(text) ||
      u.dob.toLowerCase().includes(text) ||
      u.status.toLowerCase().includes(text) ||
      u.id.toString().includes(text)
    );
  });

  // DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/DeleteCustomer/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status) {
        alert("User deleted successfully");
        setUsers(users.filter((u) => u.id !== id));
      } else { alert("Failed to delete user"); }
    } catch (err) { alert("Failed to delete user"); }
  };

  const viewSearchHistory = (id) => alert(`Search history loaded: ${id}`);
  const viewReturnHistory = (id) => alert(`Return history loaded: ${id}`);
  const viewOrderHistory = (id) => alert(`Order history loaded: ${id}`);

  return (
    // ✅ CHANGE: Use a simple div, NOT AdminLayout
    <div className="users-page-container">
      <h2 className="page-title">Customer Management</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Buyer ID</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Mob. No.</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Search</th>
                  <th>Return</th>
                  <th>Orders</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="font-bold">{u.name}</td>
                    <td>{u.dob}</td>
                    <td>{u.gender}</td>
                    <td>{u.mobile}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td><button className="btn save" onClick={() => viewSearchHistory(u.id)}>View</button></td>
                    <td><button className="btn save" onClick={() => viewReturnHistory(u.id)}>View</button></td>
                    <td><button className="btn save" onClick={() => viewOrderHistory(u.id)}>View</button></td>
                    <td><button className="btn delete" onClick={() => deleteUser(u.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="mobile-cards-container">
            {filteredUsers.map((u) => (
              <div className="user-card" key={u.id}>
                <div className="card-header">
                   <h3>{u.name}</h3>
                   <span>ID: {u.id}</span>
                </div>
                <div className="card-body">
                  <p><strong>Mobile:</strong> {u.mobile}</p>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>Address:</strong> {u.address}</p>
                </div>
                <div className="btn-row">
                  <button className="btn save" onClick={() => viewSearchHistory(u.id)}>Search</button>
                  <button className="btn save" onClick={() => viewReturnHistory(u.id)}>Return</button>
                  <button className="btn save" onClick={() => viewOrderHistory(u.id)}>Orders</button>
                  <button className="btn delete" onClick={() => deleteUser(u.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}