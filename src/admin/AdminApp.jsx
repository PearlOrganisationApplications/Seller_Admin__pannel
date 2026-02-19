import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import Banners from "./pages/Banners";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerPendingRequests from "./pages/SellerPendingRequests";
import Tearms from "./pages/Terms";
import Notifications from "./pages/Notifications";

export default function AdminApp() {
  return (
    <>
      {/* Global Toaster: Handles all notifications for the admin panel */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerId="main-toaster"
        limit={1} // <--- FINAL FIX: Only allows ONE toast on screen at a time
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            padding: '16px 24px',
            zIndex: 999999,
          },
        }}
      />

      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="Seller" element={<Seller />} />
          <Route path="seller/products/:id" element={<SellerProducts />} />
          <Route path="seller/orders/:id" element={<SellerOrders />} />
          <Route path="seller/pending-requests/:id" element={<SellerPendingRequests />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cupon-code" element={<CouponCode />} />
          <Route path="kalki-certified" element={<KalkiCertified />} />
          <Route path="Advertisement" element={<Advertisement />} />
          <Route path="AddCategory" element={<AddCategory />} />
          <Route path="SendNotification" element={<SendNotification />} />
          <Route path="banners" element={<Banners />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="view-profile" element={<ViewProfile />} />
          <Route path="smtp-settings" element={<SmtpSettings />} />
          <Route path="support" element={<Support />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="terms-policies" element={<Tearms />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<div className="p-10 text-center">Admin Page Not Found</div>} />
        </Routes>
      </AdminLayout>
    </>
  );
}