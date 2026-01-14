import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./BarChart/OrderTracking.css";

export default function OrderManage() {
  const [status, setStatus] = useState("Order placed");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  return (
    
    <div className="manage-page">
       <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2 className="heading">Order Tracking</h2>

      {/* TABLE */}
      <table className="manage-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Order ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>#KJK9632</td>

            {/* STATUS DROPDOWN */}
            <td>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="status-select"
              >
                <option>Order placed</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Out for delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </td>

            <td>12/aug/2025</td>
            <td>10:11 pm</td>

            {/* REASON INPUT */}
            <td>
              <textarea
                placeholder="Write reason..."
                className="reason-box"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </td>

            <td>
              <button className="update-btn">Update</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ACTIVITY LOG 1 */}
      <div className="log-box">
        <p>Order placed 10:11pm 12 Aug 2025</p>
        <button className="notify-btn">Send Notification</button>
      </div>

      {/* ACTIVITY LOG 2 */}
      <div className="log-box">
        <p>
          Order Cancelled 10:11pm 12 Aug 2025 
          <span className="cancel-reason">(Out of Stock)</span>
        </p>
        <button className="notify-btn">Send Notification</button>
      </div>

    </div>
  );
}
