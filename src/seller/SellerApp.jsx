import { Routes, Route, Navigate } from "react-router-dom";
import SellerLayout from "./layouts/SellerLayouts";
import SellerDashboard from "./pages/SellerDashboard";

// Import your other pages
import InventoryPage from "./pages/Inventory";
import ProductListing from "./pages/ProductListing";
import ListedProducts from "./pages/ListedProducts";
import OrderManagement from "./pages/OrderManagement";
import AllDetails from "./pages/AllDetails";
import RequestCertified from "./pages/RequestCertified";
import CertifiedProducts from "./pages/CertifiedProducts";

export default function SellerApp() {
  return (
    <Routes>
      {/* --- GROUP 1: Pages WITH Sidebar and Navbar --- */}
      <Route element={<SellerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
      </Route>

      {/* --- GROUP 2: Pages WITHOUT Sidebar and Navbar (Full Screen) --- */}
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="product-listing" element={<ProductListing />} />
      <Route path="listed-products" element={<ListedProducts />} />
      <Route path="order-management" element={<OrderManagement />} />
      <Route path="all-details" element={<AllDetails />} />
      <Route path="request-certified" element={<RequestCertified />} />
      <Route path="certified-products" element={<CertifiedProducts />} />

      {/* Catch-all */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}