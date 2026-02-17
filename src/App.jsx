import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UnifiedLogin from "./UnifiedLogin";
import AdminLoginPage from "./admin/pages/Login";
import SellerLoginPage from "./seller/pages/Login";
import AdminApp from "./admin/AdminApp";
import SellerApp from "./seller/SellerApp";
import SellerRegistration from "./seller/pages/SellerRegistration";
import GSTStep from "./seller/pages/GSTStep";
import AadharStep from "./seller/pages/AadharStep";
import ThankYou from "./seller/pages/ThankYou";

// AUTH HELPERS
function PrivateRoute({ children, requiredType }) {
  const token = localStorage.getItem("token");
  // IMPORTANT: Make sure this key matches what you set during Login!
  const userType = localStorage.getItem("user_type");

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user_type is missing, send them to login to get a fresh session
  if (!userType) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (requiredType && userType !== requiredType) {
    // If admin tries to access seller path, send to admin. 
    // If seller tries to access admin path, send to seller.
    const redirectPath = userType === "admin" ? "/admin/dashboard" : "/seller/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (isAuthenticated) {
    const redirectPath = userType === "admin" ? "/admin/dashboard" : "/seller/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicRoute><UnifiedLogin /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        <Route path="/seller/login" element={<PublicRoute><SellerLoginPage /></PublicRoute>} />

        {/* MOVED REGISTRATION HERE: It must be a PublicRoute to avoid the PrivateRoute redirect */}
        <Route path="/seller/registration" element={<PublicRoute><SellerRegistration /></PublicRoute>} />
        <Route path="/seller/gst" element={<PublicRoute> <GSTStep /> </PublicRoute>} />
        <Route path="/seller/aadhar" element={<PublicRoute> <AadharStep /> </PublicRoute>} />
        <Route path="/seller/thankyou" element={<PublicRoute> <ThankYou /> </PublicRoute>} />

        {/* PROTECTED ROUTES */}
        <Route path="/admin/*" element={<PrivateRoute requiredType="admin"><AdminApp /></PrivateRoute>} />
        <Route path="/seller/*" element={<PrivateRoute requiredType="seller"><SellerApp /></PrivateRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}