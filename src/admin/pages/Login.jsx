import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, registerAdmin } from "../api/LoginApi";

export default function AdminLogin() {
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login/Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male" // Default value
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // Handle Registration
        const data = await registerAdmin(formData);
        if (data.status || data.success) {
          alert("Registration Successful! Please login.");
          setIsRegister(false); // Switch to login view
        }
      } else {
        // Handle Login
        const data = await loginAdmin(formData.email, formData.password);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_type", "admin");
        localStorage.setItem("admin_data", JSON.stringify(data.admin));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Action Failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f7fe', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '10px', color: '#333' }}>
          {isRegister ? "Admin Register" : "Admin Login"}
        </h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          {isRegister ? "Create a new admin account" : "Enter your credentials to access"}
        </p>

        {error && (
          <div style={{ color: 'red', background: '#ffeeee', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        {/* Name Field (Register Only) */}
        {isRegister && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Full Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin Name"
              required
              style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
            style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
          />
        </div>

        {/* Phone Field (Register Only) */}
        {isRegister && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Phone Number</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              required
              style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
            />
          </div>
        )}

        {/* Gender Field (Register Only) */}
        {isRegister && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#ccc' : '#004AAD',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: '0.3s'
          }}
        >
          {loading ? "PROCESSING..." : isRegister ? "REGISTER NOW" : "LOGIN NOW"}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ border: 'none', background: 'none', color: '#004AAD', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}