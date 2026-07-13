import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, registerAdmin } from "../api/LoginApi";
import { Eye, EyeOff } from "lucide-react";
export default function AdminLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const data = await registerAdmin(formData);

        if (data.success || data.status) {
          alert("Registration Successful! Please Login.");
          setIsRegister(false);
        }
      } else {
        const data = await loginAdmin(formData.email, formData.password);

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_type", "admin");
        localStorage.setItem("admin_data", JSON.stringify(data.admin));

        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          *{
            box-sizing:border-box;
            margin:0;
            padding:0;
            font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          }

          .login-page{
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            padding:24px;
            overflow:hidden;
            background-color: #f8fafc;
            background-image: radial-gradient(at 0% 0%, hsla(217, 100%, 97%, 1) 0px, transparent 50%),
                              radial-gradient(at 100% 100%, hsla(215, 100%, 96%, 1) 0px, transparent 50%);
            position:relative;
          }

          .login-page::before{
            content:"";
            position:absolute;
            width:500px;
            height:500px;
            border-radius:50%;
            background:rgba(37,99,235,0.03);
            top:-150px;
            left:-150px;
            animation:float 10s ease-in-out infinite;
            pointer-events: none;
          }

          .login-page::after{
            content:"";
            position:absolute;
            width:400px;
            height:400px;
            border-radius:50%;
            background:rgba(59,130,246,0.03);
            bottom:-120px;
            right:-120px;
            animation:float 12s ease-in-out infinite;
            pointer-events: none;
          }

          @keyframes float{
            0%{
              transform:translateY(0px) rotate(0deg);
            }
            50%{
              transform:translateY(20px) rotate(5deg);
            }
            100%{
              transform:translateY(0px) rotate(0deg);
            }
          }

          .login-card{
            width:100%;
            max-width:480px;
            padding:40px;
            border-radius:16px;
            background:#ffffff;
            border:1px solid #e2e8f0;
            box-shadow:
            0 10px 25px -5px rgba(0,0,0,0.05),
            0 8px 10px -6px rgba(0,0,0,0.05);
            animation:fadeIn .5s ease-out;
            z-index:10;
          }

          @keyframes fadeIn{
            from{
              opacity:0;
              transform:translateY(20px);
            }
            to{
              opacity:1;
              transform:translateY(0);
            }
          }

          .logo{
            text-align:center;
            margin-bottom:32px;
          }

          .logo-circle{
            width:64px;
            height:64px;
            border-radius:12px;
            background:linear-gradient(
              135deg,
              #3b82f6,
              #1d4ed8
            );
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:26px;
            font-weight:700;
            margin: 0 auto 20px auto;
            box-shadow:0 8px 16px rgba(37,99,235,.15);
          }

          .title{
            text-align:center;
            color:#0f172a;
            font-size:24px;
            font-weight:700;
            letter-spacing:-0.5px;
          }

          .subtitle{
            text-align:center;
            color:#64748b;
            margin-top:8px;
            font-size:14px;
          }

          .form-group{
            margin-bottom:20px;
            text-align: left;
          }

          .form-group label{
            display:block;
            color:#334155;
            margin-bottom:6px;
            font-size:13px;
            font-weight:600;
          }

          .form-control{
            width:100%;
            height:46px;
            border:1px solid #cbd5e1;
            border-radius:8px;
            padding:0 16px;
            outline:none;
            background:#ffffff;
            color:#0f172a;
            font-size:14px;
            transition: all 0.2s ease-in-out;
          }

          .form-control::placeholder{
            color:#94a3b8;
          }

          .form-control:focus{
            border-color:#3b82f6;
            box-shadow:0 0 0 3px rgba(59,130,246,0.15);
          }

          select.form-control {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 18px;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            cursor: pointer;
          }

          .error-box{
            background:#fef2f2;
            border:1px solid #fee2e2;
            color:#991b1b;
            padding:12px 16px;
            border-radius:8px;
            margin-bottom:20px;
            font-size:13.5px;
            text-align:center;
          }

          .submit-btn{
            width:100%;
            height:46px;
            border:none;
            border-radius:8px;
            background:#2563eb;
            color:white;
            font-size:14px;
            font-weight:600;
            cursor:pointer;
            transition: all 0.2s ease-in-out;
            margin-top:10px;
          }

          .submit-btn:hover{
            background:#1d4ed8;
          }

          .submit-btn:active{
            transform:translateY(1px);
          }

          .submit-btn:disabled{
            background:#93c5fd;
            cursor:not-allowed;
          }

          .switch-btn{
            margin-top:20px;
            width:100%;
            background:none;
            border:none;
            color:#2563eb;
            font-size:14px;
            cursor:pointer;
            font-weight:600;
            transition: color 0.2s ease;
          }

          .switch-btn:hover{
            color:#1d4ed8;
            text-decoration: underline;
          }
        `}
      </style>

      <div className="login-page">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="logo">
            <div className="logo-circle">A</div>

            <h2 className="title">
              {isRegister ? "Admin Registration" : "Admin Login"}
            </h2>

            <p className="subtitle">
              {isRegister
                ? "Create your administrator account"
                : "Securely access your admin dashboard"}
            </p>
          </div>

          {error && <div className="error-box">{error}</div>}

          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>

            <div style={{ position: "relative" }}>
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#64748b",
                }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}{" "}
              </span>
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? "PLEASE WAIT..."
              : isRegister
                ? "REGISTER NOW"
                : "LOGIN NOW"}
          </button>

          <button
            type="button"
            className="switch-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </>
  );
}
