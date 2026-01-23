import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/LoginApi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      console.log(data);
      

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_type", "admin");
      localStorage.setItem("admin_data", JSON.stringify(data.admin));

      navigate("/admin/dashboard");

    } catch (err) {
      // Handle error message from API response
      const errorMessage = err.response?.data?.message || "Login Failed: Invalid credentials or server error.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7fe' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '20px', color: '#333' }}>Admin Login</h2>

        {error && (
          <div style={{ color: 'red', background: '#ffeeee', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button while loading
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
          {loading ? "AUTHENTICATING..." : "LOGIN NOW"}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#bbb' }}>
          Secure Admin Access
        </div>
      </form>
    </div>
  );
}