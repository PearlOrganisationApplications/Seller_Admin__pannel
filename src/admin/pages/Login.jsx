import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // STATIC CREDENTIALS
  const STATIC_ADMIN = {
    email: "admin1@gmail.com",
    password: "admin@123"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Check against static data instead of API
    if (email === STATIC_ADMIN.email && password === STATIC_ADMIN.password) {
      
      localStorage.setItem("access_token", "static_dev_token_123");
      
      localStorage.setItem("user_type", "admin");
  
      localStorage.setItem("admin_data", JSON.stringify({ name: "Admin User", email: email }));

      window.location.href = "/admin/dashboard"; 
    } else {
      setError("Static Login Failed: Invalid email or password.");
    }
  };

  return (
    <div className="admin-login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7fe' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '20px', color: '#333' }}>Admin Login</h2>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '20px' }}>Development Mode (Static Login)</p>
        
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
            placeholder="admin1@gmail.com"
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
            placeholder="admin@123"
            required 
            style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none' }} 
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '15px', border: 'none', background: '#004AAD', color: '#fff', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' }}
          onMouseOver={(e) => e.target.style.background = '#003580'}
          onMouseOut={(e) => e.target.style.background = '#004AAD'}
        >
          LOGIN NOW
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#bbb' }}>
           Static Bypass Enabled for Testing
        </div>
      </form>
    </div>
  );
}