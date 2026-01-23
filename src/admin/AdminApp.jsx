import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

// IMPORT ALL YOUR PAGES
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Seller from "./pages/Seller";
import Orders from "./pages/Orders";
import CouponCode from "./pages/CouponCode";
import KalkiCertified from "./pages/KalkiCertified";
import Advertisement from "./pages/Advertisement";
import AddCategory from "./pages/AddCategory";
import SendNotification from "./pages/SendNotification";
import OrderTracking from "./pages/OrderTracking";
import ViewProfile from "./pages/ViewProfile";
import SmtpSettings from "./pages/SmtpSettings";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";  

export default function AdminApp() {
  return (
    <AdminLayout>
      <Routes>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Match these paths exactly with Sidebar Links */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="Seller" element={<Seller />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cupon-code" element={<CouponCode />} />
        <Route path="kalki-certified" element={<KalkiCertified />} />
        <Route path="Advertisement" element={<Advertisement />} />
        <Route path="AddCategory" element={<AddCategory />} />
        <Route path="SendNotification" element={<SendNotification />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="view-profile" element={<ViewProfile />} />
        <Route path="smtp-settings" element={<SmtpSettings />} />
        <Route path="support" element={<Support />} />
        <Route path="about-us" element={<AboutUs />} />

        {/* Catch-all for admin sub-routes */}
        <Route path="*" element={<div className="p-10 text-center">Admin Page Not Found</div>} />
      </Routes>
    </AdminLayout>
  );
}