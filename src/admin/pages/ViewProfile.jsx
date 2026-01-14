import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/BaseUrl";
import axios from "axios";
import Defaulting from "../img/admin_profile.webp";

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
    address: "",
  });

  const fileInputRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token"); // fixed token key

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const user = data.admin || data;

        setProfile(user);
        setEditData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          state: user.state,
          city: user.city,
          address: user.address,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/admin/profile-update`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      setProfile({ ...profile, ...editData });
      localStorage.setItem("adminName", editData.name);
      window.dispatchEvent(new Event("storage"));
      setEditMode(false);
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/profile-update-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile picture updated!");
      setProfile({ ...profile, image: res.data.image });
      localStorage.setItem("adminImage", res.data.image);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Image update error", error);
      alert("Failed to update image");
    }
  };

  if (loading) return <h2 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  if (error) return <h2 style={{ color: "red", textAlign: "center", marginTop: "100px" }}>{error}</h2>;

  return (
    <div style={{ padding: "40px", background: "#111827", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={buttonHome}
      >
        🏠 Home
      </button>

      <div style={containerStyle}>
        <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>My Profile</h2>

        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={profile.image && profile.image.trim() !== "" ? `https://kalkideals.com/uploads/admin/${profile.image}` : Defaulting}
            alt="Profile"
            style={profileImageStyle}
          />

          {editMode && (
            <>
              <span
                onClick={() => fileInputRef.current.click()}
                style={editIconStyle}
              >
                ✎
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        <div style={{ textAlign: "left", marginTop: "20px", color: "#e5e7eb" }}>
          {renderField("Name", "name", editMode, editData, setEditData)}
          {renderField("Email", "email", editMode, editData, setEditData)}
          {renderField("Phone", "phone", editMode, editData, setEditData)}
          {renderField("Gender", "gender", editMode, editData, setEditData)}
          {renderField("City", "city", editMode, editData, setEditData)}
          {renderField("State", "state", editMode, editData, setEditData)}
          {renderField("Address", "address", editMode, editData, setEditData)}
        </div>

        {!editMode ? (
          <>
            <button onClick={() => setEditMode(true)} style={buttonPrimary}>Edit Profile</button>
            <button onClick={() => navigate("/change-password")} style={buttonSecondary}>Change Password</button>
          </>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <button onClick={handleSave} style={buttonPrimary}>Save Changes</button>
            <button onClick={() => setEditMode(false)} style={buttonCancel}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function renderField(label, key, editMode, data, setData) {
  return (
    <p style={{ marginBottom: "12px" }}>
      <strong style={{ color: "white" }}>{label}:</strong> <br />
      {editMode ? (
        <input
          value={data[key] || ""}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
          style={inputStyle}
        />
      ) : (
        <span style={{ color: "#d1d5db" }}>{data[key] || "N/A"}</span>
      )}
    </p>
  );
}

const containerStyle = {
  width: "450px",
  background: "#1f2937",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
  textAlign: "center",
  color: "white",
};

const profileImageStyle = {
  width: "140px",
  height: "140px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #374151",
};

const editIconStyle = {
  position: "absolute",
  bottom: "8px",
  right: "10px",
  background: "#2563eb",
  color: "white",
  padding: "8px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #4b5563",
  background: "#374151",
  color: "white",
  marginTop: "5px",
};

const buttonPrimary = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "20px",
};

const buttonSecondary = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#10b981",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "12px",
};

const buttonCancel = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#6b7280",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "10px",
};

const buttonHome = {
  alignSelf: "flex-start",
  padding: "8px 16px",
  background: "#1d4ed8",
  color: "white",
  fontSize: "15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "25px",
};
