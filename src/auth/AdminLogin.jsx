import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/pages/BarChart/index"
import { BASE_URL } from "../admin/api/BaseUrl";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Redirect if already logged in as ADMIN
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token && role === "ADMIN") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid admin credentials.");
        } else {
          setError(data.message || "Login failed. Try again later.");
        }
        setLoading(false);
        return;
      }

      // ✅ Extract token safely
      const token = data.token || data.access_token;
      if (!token) {
        setError("Login successful but token missing.");
        setLoading(false);
        return;
      }

      // ✅ Save auth data (RBAC ready)
      localStorage.setItem("access_token", token);
      localStorage.setItem("role", "ADMIN");
      localStorage.setItem("admin", JSON.stringify(data.admin || {}));

      // ✅ Redirect to Admin Dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {error && <h2 className="error-top-message">{error}</h2>}

      <div className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <a href="#">Forget Password</a>
          </form>
        </div>
      </div>
    </div>
  );
}
