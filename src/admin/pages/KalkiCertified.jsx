import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BarChart/KalkiCertified.css";

export default function KalkiCertified() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const certificates = [
    {
      id: 1,
      name: "John Doe",
      seller: "Tech Bazaar",
      status: "Approved",
      date: "2025-02-20",
    },
    {
      id: 2,
      name: "Priya Sharma",
      seller: "Fashion Hub",
      status: "Pending",
      date: "2025-02-18",
    },
    {
      id: 3,
      name: "Aman Gupta",
      seller: "Gadget World",
      status: "Rejected",
      date: "2025-02-15",
    },
  ];

  return (
    <div className="certified-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="certified-header">
        <h2>Kalkideals Certified Management</h2>
        <p>Manage seller verification & certification.</p>
      </div>

      <div className="certified-top-bar">
        <input
          type="text"
          placeholder="Search seller name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn">+ Add Certificate</button>
      </div>

      <table className="certified-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Seller Name</th>
            <th>Business Name</th>
            <th>Status</th>
            <th>Issued Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {certificates
            .filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.seller}</td>

                <td>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>

                <td>{item.date}</td>

                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
