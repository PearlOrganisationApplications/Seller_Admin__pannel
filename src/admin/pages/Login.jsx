import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, registerAdmin } from "../api/LoginApi";

export default function AdminLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
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
            font-family:'Segoe UI',sans-serif;
          }

          .login-page{
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            padding:20px;
            overflow:hidden;
            background:linear-gradient(
              135deg,
              #0f172a,
              #1e3a8a,
              #2563eb
            );
            position:relative;
          }

          .login-page::before{
            content:"";
            position:absolute;
            width:400px;
            height:400px;
            border-radius:50%;
            background:rgba(255,255,255,0.15);
            top:-120px;
            left:-120px;
            animation:float 6s ease-in-out infinite;
          }

          .login-page::after{
            content:"";
            position:absolute;
            width:300px;
            height:300px;
            border-radius:50%;
            background:rgba(255,255,255,0.08);
            bottom:-100px;
            right:-100px;
            animation:float 8s ease-in-out infinite;
          }

          @keyframes float{
            0%{
              transform:translateY(0px);
            }
            50%{
              transform:translateY(30px);
            }
            100%{
              transform:translateY(0px);
            }
          }

          .login-card{
            width:100%;
            max-width:500px;
            padding:40px;
            border-radius:24px;
            background:rgba(255,255,255,0.12);
            backdrop-filter:blur(20px);
            border:1px solid rgba(255,255,255,0.2);
            box-shadow:
            0 20px 50px rgba(0,0,0,0.3);
            animation:fadeIn .6s ease;
            z-index:10;
          }

          @keyframes fadeIn{
            from{
              opacity:0;
              transform:translateY(40px);
            }
            to{
              opacity:1;
              transform:translateY(0);
            }
          }

          .logo{
            text-align:center;
            margin-bottom:25px;
          }

          .logo-circle{
            width:80px;
            height:80px;
            border-radius:50%;
            background:linear-gradient(
              135deg,
              #60a5fa,
              #2563eb
            );
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:28px;
            font-weight:700;
            margin:auto;
            box-shadow:0 10px 30px rgba(37,99,235,.4);
          }

          .title{
            text-align:center;
            color:white;
            font-size:28px;
            font-weight:700;
            margin-top:15px;
          }

          .subtitle{
            text-align:center;
            color:#dbeafe;
            margin-top:8px;
            margin-bottom:30px;
            font-size:14px;
          }

          .form-group{
            margin-bottom:18px;
          }

          .form-group label{
            display:block;
            color:white;
            margin-bottom:8px;
            font-size:13px;
            font-weight:600;
          }

          .form-control{
            width:100%;
            height:55px;
            border:none;
            border-radius:14px;
            padding:0 18px;
            outline:none;
            background:rgba(255,255,255,0.15);
            color:white;
            font-size:15px;
            transition:.3s;
          }

          .form-control::placeholder{
            color:#d1d5db;
          }

          .form-control:focus{
            background:rgba(255,255,255,0.22);
            box-shadow:
            0 0 0 3px rgba(96,165,250,.4);
          }

          .error-box{
            background:rgba(255,0,0,.12);
            border:1px solid rgba(255,0,0,.3);
            color:#ffd7d7;
            padding:12px;
            border-radius:12px;
            margin-bottom:18px;
            text-align:center;
          }

          .submit-btn{
            width:100%;
            height:55px;
            border:none;
            border-radius:14px;
            background:linear-gradient(
              135deg,
              #3b82f6,
              #2563eb
            );
            color:white;
            font-size:15px;
            font-weight:700;
            cursor:pointer;
            transition:.35s;
            margin-top:10px;
          }

          .submit-btn:hover{
            transform:translateY(-3px);
            box-shadow:
            0 15px 30px rgba(37,99,235,.4);
          }

          .submit-btn:active{
            transform:scale(.98);
          }

          .submit-btn:disabled{
            opacity:.7;
            cursor:not-allowed;
          }

          .switch-btn{
            margin-top:20px;
            width:100%;
            background:none;
            border:none;
            color:#bfdbfe;
            font-size:14px;
            cursor:pointer;
            font-weight:600;
          }

          .switch-btn:hover{
            color:white;
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
            <input
              className="form-control"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
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
