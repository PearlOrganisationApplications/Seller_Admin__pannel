import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./BarChart/SendNotification.css";

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("image");
  const [image, setImage] = useState(null);
  const [time, setTime] = useState("");

  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const navigate = useNavigate();

  const handleDone = () => {
    navigate("/admin/dashboard"); 
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h3>Send Notification</h3>
        <button className="done-btn" onClick={handleDone}>Done</button>
      </div>

      <div className="form-container">
        <h4>Send Push Notification</h4>

        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="row">
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="users">Seller</option>
            <option value="drivers">Customer</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="image">Image/Text</option>
            <option value="text">Text Only</option>
          </select>
        </div>

        <input type="file" onChange={handleImageUpload} />

        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button className="preview-btn">Load Preview</button>
      </div>

      <h4 className="final-look">Final Look</h4>

      <div className="preview-card">
        <div className="preview-header">
          <span className="circle">K</span>
          <span className="brand">kulstylers</span>
          <span className="time">• Just now</span>
        </div>

        <div className="preview-content">
          <h5>{title || "New and classy Top wear"}</h5>
          <p>
            {message ||
              "Men solid polo neck Polyester T-Shirt starting from Rs. 259/-. Limited Stock Available!"}
          </p>

          {image && <img src={image} alt="preview" className="preview-img" />}
        </div>

        <button className="cta-btn">Shop Now</button>
      </div>
    </div>
  );
}
