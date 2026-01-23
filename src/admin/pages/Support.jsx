import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSearch, FaEye, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSupportRequests } from "../api/supportApi"; 
import "./BarChart/KalkiCertified.css"; 

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getSupportRequests();
      if (res.status) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch support data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const filteredTickets = tickets.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  return (
    <div className="certified-container">
      <div className="header-section">
        <button className="back-btn-new" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="header-text">
          <h2>Support Management</h2>
          <p>View and manage customer inquiries and messages</p>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Name, Email or Phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="refresh-btn" onClick={fetchTickets}>Refresh</button>
      </div>

      <div className="table-wrapper">
        <table className="certified-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Message Preview</th>
              <th>Received Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading tickets...</td></tr>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td className="uid-cell">#{t.id}</td>
                  <td className="name-cell">{t.name}</td>
                  <td>
                    <div style={{fontSize: '13px'}}>{t.email}</div>
                    <div style={{fontSize: '12px', color: '#888'}}>{t.phone}</div>
                  </td>
                  <td style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {t.message}
                  </td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="action-edit-btn" onClick={() => handleViewDetails(t)}>
                      <FaEye /> View details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No support requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW DETAILS MODAL */}
      {showModal && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content enhanced-modal">
            <div className="modal-header">
              <h3>Support Inquiry Details</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="item-summary" style={{marginBottom: '15px'}}>
                <p><strong>From:</strong> {selectedTicket.name}</p>
                <p><strong>Email:</strong> {selectedTicket.email}</p>
                <p><strong>Phone:</strong> {selectedTicket.phone}</p>
                <p><strong>Date:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>
              
              <div className="form-group">
                <label>Customer Message</label>
                <div style={{
                  background: '#f9f9f9', 
                  padding: '15px', 
                  borderRadius: '10px', 
                  border: '1px solid #eee',
                  lineHeight: '1.6',
                  fontSize: '14px',
                  color: '#444',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedTicket.message}
                </div>
              </div>

              <div className="modal-footer" style={{marginTop: '20px'}}>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                {/* CORRECTED TAG BELOW */}
                <a 
                  href={`mailto:${selectedTicket.email}`} 
                  className="btn-primary" 
                  style={{textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                  Reply via Email
                </a> 
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}