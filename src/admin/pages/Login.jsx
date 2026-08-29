import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, registerAdmin } from "../api/LoginApi";
import { Eye, EyeOff, UserCog } from "lucide-react";

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

  const bubbles = [
    { size: 70, left: "8%", delay: "0s", duration: "20s" },
    { size: 40, left: "20%", delay: "4s", duration: "6s" },
    { size: 95, left: "35%", delay: "2s", duration: "14s" },
    { size: 35, left: "90%", delay: "6s", duration: "4s" },
    { size: 75, left: "65%", delay: "1s", duration: "12s" },
    { size: 80, left: "78%", delay: "5s", duration: "8s" },
    { size: 95, left: "90%", delay: "3s", duration: "15s" },
    { size: 85, left: "90%", delay: "3s", duration: "15s" },
    { size: 45, left: "80%", delay: "3s", duration: "5s" },
    { size: 95, left: "30%", delay: "3s", duration: "15s" },

  ];

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

          @keyframes floatUp {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 0.35; }
            90% { opacity: 0.25; }
            100% { transform: translateY(-105vh); opacity: 0; }
          }

          .login-page{
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            padding:24px;
            overflow:hidden;
            position:relative;
            background-color:#0f1226;
            background-image:
              radial-gradient(at 0% 0%, rgba(124,58,237,0.25) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(14,165,233,0.25) 0px, transparent 50%),
              linear-gradient(135deg, #0f1226 0%, #241b52 55%, #0e3a5f 100%);
          }

          .login-page::before{
            content:"";
            position:absolute;
            width:480px;
            height:480px;
            border-radius:50%;
            background:rgba(124,58,237,0.12);
            top:-160px;
            left:-160px;
            filter:blur(80px);
            pointer-events:none;
          }

          .login-page::after{
            content:"";
            position:absolute;
            width:420px;
            height:420px;
            border-radius:50%;
            background:rgba(14,165,233,0.12);
            bottom:-140px;
            right:-140px;
            filter:blur(80px);
            pointer-events:none;
          }

          .bubble{
            position:absolute;
            bottom:-10%;
            border-radius:9999px;
            background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(147,197,253,0.04));
            border:1px solid rgba(255,255,255,0.08);
            pointer-events:none;
          }

          .login-card{
            width:100%;
            max-width:480px;
            padding:40px;
            border-radius:20px;
            background:#ffffff;
            border:1px solid rgba(255,255,255,0.6);
            box-shadow:0 20px 60px rgba(15,18,38,0.5);
            animation:fadeIn .5s ease-out;
            position:relative;
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
            border-radius:14px;
            background:linear-gradient(135deg, #7c3aed, #0ea5e9);
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            margin:0 auto 20px auto;
            box-shadow:0 10px 24px rgba(124,58,237,0.3);
          }

          .title{
            text-align:center;
            color:#0f172a;
            font-size:24px;
            font-weight:800;
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
            text-align:left;
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
            border-radius:10px;
            padding:0 16px;
            outline:none;
            background:#f8fafc;
            color:#0f172a;
            font-size:14px;
            transition:all 0.2s ease-in-out;
          }

          .form-control::placeholder{
            color:#94a3b8;
          }

          .form-control:focus{
            border-color:#7c3aed;
            background:#ffffff;
            box-shadow:0 0 0 3px rgba(124,58,237,0.15);
          }

          select.form-control{
            background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position:right 12px center;
            background-repeat:no-repeat;
            background-size:18px;
            appearance:none;
            -webkit-appearance:none;
            -moz-appearance:none;
            cursor:pointer;
          }

          .error-box{
            background:#fef2f2;
            border:1px solid #fee2e2;
            color:#991b1b;
            padding:12px 16px;
            border-radius:10px;
            margin-bottom:20px;
            font-size:13.5px;
            text-align:center;
          }

          .submit-btn{
            width:100%;
            height:46px;
            border:none;
            border-radius:10px;
            background:linear-gradient(135deg, #7c3aed, #2563eb);
            color:white;
            font-size:14px;
            font-weight:700;
            letter-spacing:0.3px;
            cursor:pointer;
            transition:all 0.2s ease-in-out;
            margin-top:10px;
            box-shadow:0 10px 24px rgba(124,58,237,0.25);
          }

          .submit-btn:hover{
            filter:brightness(1.08);
            transform:translateY(-1px);
          }

          .submit-btn:active{
            transform:translateY(1px);
          }

          .submit-btn:disabled{
            background:#c4b5fd;
            box-shadow:none;
            cursor:not-allowed;
            transform:none;
          }

          .switch-btn{
            margin-top:20px;
            width:100%;
            background:none;
            border:none;
            color:#7c3aed;
            font-size:14px;
            cursor:pointer;
            font-weight:600;
            transition:color 0.2s ease;
          }

          .switch-btn:hover{
            color:#5b21b6;
            text-decoration:underline;
          }
        `}
      </style>

      <div className="login-page">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animation: `floatUp ${b.duration} ease-in-out infinite`,
              animationDelay: b.delay,
            }}
          />
        ))}

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="logo">
            <div className="logo-circle">
              <UserCog size={28} />
            </div>

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
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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