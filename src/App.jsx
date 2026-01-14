import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UnifiedLogin from "./UnifiedLogin";
import AdminLoginPage from "./admin/pages/Login"; 
import SellerLoginPage from "./seller/pages/Login";
import AdminApp from "./admin/AdminApp"; 
import SellerApp from "./seller/SellerApp";

// AUTH HELPERS
function PrivateRoute({ children, requiredType }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  // If token is missing or is the broken string "undefined"
  if (!token || token === "undefined") {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
  
  // If user tries to access admin panel with seller credentials
  if (requiredType && userType !== requiredType) {
    const redirectPath = userType === "admin" ? "/admin/dashboard" : "/seller/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  if (token && token !== "undefined") {
    const redirectPath = userType === "admin" ? "/admin/dashboard" : "/seller/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><UnifiedLogin /></PublicRoute>} /> 
        <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        <Route path="/seller/login" element={<PublicRoute><SellerLoginPage /></PublicRoute>} />

        {/* The /* is critical for internal routing to work */}
        <Route path="/admin/*" element={<PrivateRoute requiredType="admin"><AdminApp /></PrivateRoute>} />
        <Route path="/seller/*" element={<PrivateRoute requiredType="seller"><SellerApp /></PrivateRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
} 